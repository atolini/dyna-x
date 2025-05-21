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
 * @class S3StorageService
 * @implements {IFileStorageService}
 *
 * @classdesc
 * AWS S3 implementation of the IStorageService interface for file storage operations.
 *
 * This service provides methods to upload, retrieve, delete, and list files in an S3 bucket.
 * It supports sending files as Buffers, strings, or Readable streams and retrieves files as strings.
 *
 * @example
 * // Example: Create an S3 storage service and upload a file
 * const storage = new S3StorageService('my-bucket', 'us-east-1');
 * await storage.uploadFile('folder/file.txt', 'content', 'text/plain');
 */
export class S3FileStorageService implements IFileStorageService {
  private s3: S3Client;

  /**
   * Constructs a new instance of S3StorageService.
   *
   * @param {string} bucketName - The name of the S3 bucket to operate on.
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
   * @throws {EncryptionTypeMismatch} If the encryption type of the file does not match the expected type.
   * @throws {InvalidRequest} If the request is invalid.
   *
   * This function uses the AWS SDK commands:
   * - {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/command/PutObjectCommand/ | PutObjectCommand}
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
   * This method fetches an object using the specified key (path) from the S3 bucket configured during service initialization.
   * If the object is stored in an archived storage class (e.g., S3 Glacier or S3 Intelligent-Tiering archive tiers), it must be
   * restored first using the `RestoreObjectCommand`, otherwise an `InvalidObjectState` error will be thrown.
   *
   * @param {string} key - The object key (path) of the file to retrieve from the bucket.
   * @returns {Promise<string>} A promise that resolves to the file content as a string.
   *
   * @throws {NoSuchKey} If the specified object key does not exist in the bucket.
   * @throws {NoSuchBucket} If the specified bucket does not exist.
   * @throws {InvalidObjectState} If the object is archived and must be restored before access.
   *
   * This function uses the AWS SDK command:
   * - {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/command/GetObjectCommand/ | GetObjectCommand}
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
   * This function uses the AWS SDK command:
   * - {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/command/DeleteObjectCommand/ | DeleteObjectCommand}
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
   * @throws {NoSuchBucket} If the specified bucket does not exist.
   *
   * This function uses the AWS SDK command:
   * - {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/command/ListObjectsV2Command/ | ListObjectsV2Command}
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

      keys.push(...(response.Contents?.map((item) => item.Key || '') || []));
      continuationToken = response.NextContinuationToken;
    } while (continuationToken);

    this.eventLogger.filesListed(keys);

    return keys;
  }
}
