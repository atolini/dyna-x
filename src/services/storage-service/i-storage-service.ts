import { Readable } from "stream";

export interface IStorageService {
  /**
   * Uploads a file to the storage.
   * @param key - The identifier (path) of the file in storage.
   * @param body - The content of the file (Buffer, Readable stream, or string).
   * @param contentType - The MIME type of the file.
   */
  uploadFile(key: string, body: Buffer | Readable | string, contentType: string): Promise<void>;

  /**
   * Retrieves a file from the storage.
   * @param key - The identifier (path) of the file in storage.
   * @returns The file content as a Buffer.
   */
  getFile(key: string): Promise<Buffer>;

  /**
   * Deletes a file from the storage.
   * @param key - The identifier (path) of the file in storage.
   */
  deleteFile(key: string): Promise<void>;

  /**
   * Lists all files in the storage.
   * @param prefix - Optional prefix to filter files.
   * @returns An array of file identifiers (keys).
   */
  listFiles(prefix?: string): Promise<string[]>;
}