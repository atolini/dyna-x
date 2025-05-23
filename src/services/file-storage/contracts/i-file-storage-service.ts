import { Readable } from 'stream';

/**
 * @interface IFileStorageService
 *
 * @description
 * Interface for file storage operations, providing methods to upload, retrieve, delete, and list files in a storage system.
 * Implementations may use local storage, cloud storage (e.g., AWS S3), or other storage backends.
 */
export interface IFileStorageService {
  /**
   * Uploads a file to the storage.
   * @param key - The identifier (path) of the file in storage.
   * @param body - The content of the file (Buffer, Readable stream, or string).
   * @param contentType - The MIME type of the file.
   * @returns {Promise<void>} A promise that resolves when the file is uploaded.
   */
  uploadFile(
    key: string,
    body: Buffer | Readable | string,
    contentType: string,
  ): Promise<void>;

  /**
   * Retrieves a file from the storage.
   * @param key - The identifier (path) of the file in storage.
   * @returns {Promise<string>} A promise that resolves to the file content.
   */
  getFile(key: string): Promise<string>;

  /**
   * Deletes a file from the storage.
   * @param key - The identifier (path) of the file in storage.
   * @returns {Promise<void>} A promise that resolves when the file is deleted.
   */
  deleteFile(key: string): Promise<void>;

  /**
   * Lists all files in the storage.
   * @param prefix - Optional prefix to filter files.
   * @returns {Promise<string[]>} A promise that resolves to an array of file identifiers (keys).
   */
  listFiles(prefix?: string): Promise<string[]>;
}
