import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { IStorageService } from "./i-storage-service";

/**
 * Implementation of IStorageService for AWS S3 storage.
 * Provides methods to upload, retrieve, delete, and list files in an S3 bucket.
 * 
 * @example
 * const storage = new S3StorageService('us-east-1', 'my-bucket');
 * await storage.uploadFile('path/to/file.txt', 'content', 'text/plain');
 */
export class S3StorageService implements IStorageService {
  private s3: S3Client;
  private bucketName: string;

  /**
   * Creates an instance of S3StorageService.
   * @param {string} region - The AWS region where the bucket is located (e.g., 'us-east-1').
   * @param {string} bucketName - The name of the S3 bucket to operate on.
   */
  constructor(region: string, bucketName: string) {
    this.s3 = new S3Client({ region });
    this.bucketName = bucketName;
  }

  /**
   * Uploads a file to the S3 bucket.
   * @param {string} key - The object key (path) in the bucket.
   * @param {Buffer | Readable | string} body - The file content to upload.
   * @param {string} contentType - The MIME type of the file.
   * @returns {Promise<void>} Resolves when the upload is complete.
   * @throws {Error} If the upload fails.
   */
  async uploadFile(key: string, body: Buffer | Readable | string, contentType: string): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
    });

    await this.s3.send(command);
  }

  /**
   * Retrieves a file from the S3 bucket as a Buffer.
   * @param {string} key - The object key (path) in the bucket.
   * @returns {Promise<Buffer>} The file content as a Buffer.
   * @throws {Error} If the file doesn't exist or can't be read.
   */
  async getFile(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const response = await this.s3.send(command);

    if (!response.Body) {
      throw new Error("File not found");
    }

    const chunks: Uint8Array[] = [];
    for await (const chunk of response.Body as Readable) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  }

  /**
   * Deletes a file from the S3 bucket.
   * @param {string} key - The object key (path) in the bucket.
   * @returns {Promise<void>} Resolves when the deletion is complete.
   * @throws {Error} If the deletion fails.
   */
  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3.send(command);
  }

  /**
   * Lists all files in the S3 bucket.
   * @returns {Promise<string[]>} An array of object keys (paths) in the bucket.
   * @throws {Error} If the listing operation fails.
   */
  async listFiles(): Promise<string[]> {
    const command = new ListObjectsV2Command({
      Bucket: this.bucketName,
    });

    const response = await this.s3.send(command);
    return response.Contents?.map((item) => item.Key || "") || [];
  }
}