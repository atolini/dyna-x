import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import {
  IFileStorageService,
  IFileStorageServiceEventLogger,
} from '@file-storage/contracts';

/**
 * @class S3FileStorageService
 * @implements {IFileStorageService}
 *
 * @classdesc
 * AWS S3 implementation of the IFileStorageService interface for file storage operations.
 *
 * This service provides methods to upload, retrieve, delete, and list files in an S3 bucket.
 * It supports sending files as Buffers, strings, or Readable streams and retrieves files as strings.
 *
 * @example
 * // Example: Create an S3 storage service and upload a file
 * const storage = new S3FileStorageService('my-bucket', eventLogger, 'us-east-1');
 * await storage.uploadFile('folder/file.txt', 'content', 'text/plain');
 */
export class S3FileStorageService implements IFileStorageService {
  private readonly s3: S3Client;

  /**
   * Constructs a new instance of S3FileStorageService.
   *
   * @param {string} bucketName - The name of the S3 bucket to operate on.
   * @param {IFileStorageServiceEventLogger} eventLogger - The logger instance used to log file-related events.
   * @param {string} [region] - AWS region for the S3 client (optional).
   */
  constructor(
    private readonly bucketName: string,
    private readonly eventLogger: IFileStorageServiceEventLogger,
    region?: string,
  ) {
    this.s3 = new S3Client(region ? { region } : {});
  }

  /**
   * Uploads a file to the configured S3 bucket.
   *
   * @param {string} key - The object key (path) under which the file will be stored.
   * @param {Buffer | Readable | string} body - The file content to be uploaded.
   * @param {string} contentType - The MIME type of the file.
   * @returns {Promise<void>} A promise that resolves once the file is uploaded.
   *
   * This method uses the AWS SDK {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/command/PutObjectCommand/ PutObjectCommand}.
   */
  async uploadFile(
    key: string,
    body: Buffer | Readable | string,
    contentType: string,
  ): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
    });

    await this.s3.send(command);

    this.eventLogger.fileUploaded(key, contentType);
  }

  /**
   * Retrieves the content of a file from the configured S3 bucket.
   *
   * @param {string} key - The object key (path) of the file to retrieve from the bucket.
   * @returns {Promise<string>} A promise that resolves to the file content as a string.
   *
   * If the object is archived in a storage class like S3 Glacier or Intelligent-Tiering archive tiers,
   * it must be restored manually using the RestoreObjectCommand before it can be accessed.
   *
   * This method uses the AWS SDK {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/command/GetObjectCommand/ GetObjectCommand}.
   */
  async getFile(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const response = await this.s3.send(command);

    const chunks: Uint8Array[] = [];
    for await (const chunk of response.Body as Readable) {
      chunks.push(chunk);
    }

    this.eventLogger.fileRetrieved(key);

    return Buffer.concat(chunks).toString('utf-8');
  }

  /**
   * Deletes a file from the configured S3 bucket.
   *
   * @param {string} key - The object key (path) of the file to delete.
   * @returns {Promise<void>} A promise that resolves once the file is deleted.
   *
   * This method uses the AWS SDK {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/command/DeleteObjectCommand/ DeleteObjectCommand}.
   */
  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3.send(command);

    this.eventLogger.fileDeleted(key);
  }

  /**
   * Lists all files in the configured S3 bucket.
   *
   * @returns {Promise<string[]>} An array of object keys (paths) found in the bucket.
   *
   * This method uses the AWS SDK {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/command/ListObjectsV2Command/ ListObjectsV2Command}.
   */
  async listFiles(): Promise<string[]> {
    const keys: string[] = [];
    let continuationToken: string | undefined;

    do {
      const response = await this.s3.send(
        new ListObjectsV2Command({
          Bucket: this.bucketName,
          ContinuationToken: continuationToken,
        }),
      );

      keys.push(...(response.Contents?.map((item) => item.Key ?? '') ?? []));
      continuationToken = response.NextContinuationToken;
    } while (continuationToken);

    this.eventLogger.filesListed(keys);

    return keys;
  }
}
