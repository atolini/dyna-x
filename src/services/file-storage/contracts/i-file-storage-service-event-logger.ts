/**
 * Defines a contract for logging events related to file storage operations.
 * This interface abstracts away the storage provider and focuses on generic file event logging.
 */
export interface IFileStorageServiceEventLogger {
  /**
   * Logs the event of a file being uploaded.
   * @param path - The storage path or identifier of the uploaded file.
   * @param mimeType - The MIME type of the uploaded file.
   */
  fileUploaded(path: string, mimeType: string): void;

  /**
   * Logs the event of a file being retrieved.
   * @param path - The storage path or identifier of the retrieved file.
   */
  fileRetrieved(path: string): void;

  /**
   * Logs the event of a file being deleted.
   * @param path - The storage path or identifier of the deleted file.
   */
  fileDeleted(path: string): void;

  /**
   * Logs the event of listing files.
   * @param paths - The list of file paths or identifiers returned by the listing operation.
   */
  filesListed(paths: string[]): void;
}
