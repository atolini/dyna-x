import { ILogger } from '@logger/contracts';

/**
 * @class S3StorageLogger
 * @classdesc
 * Helper class responsible for logging file-related events performed by the {@link S3StorageService}.
 *
 * Logs upload, retrieval, deletion, and listing of files from the S3 bucket in a structured format using the provided logger instance.
 * This logger improves observability and auditability of file operations.
 *
 * @example
 * const logger = new ConsoleLogger(); // implements ILogger
 * const storageLogger = new S3StorageLogger(logger, 'my-bucket');
 * storageLogger.fileUploaded('folder/file.txt', 'text/plain');
 */
export class S3StorageEventLogger {
  private logger: ILogger<unknown>;
  private readonly bucketName: string;

  /**
   * Creates an instance of S3StorageLogger.
   *
   * @param {ILogger<any>} logger - A logger instance that implements the ILogger interface.
   * @param {string} bucketName - The name of the S3 bucket associated with the storage events.
   */
  constructor(logger: ILogger<unknown>, bucketName: string) {
    this.logger = logger;
    this.bucketName = bucketName;
  }

  /**
   * Logs a file upload event.
   *
   * @param {string} key - The object key (path) of the uploaded file.
   * @param {string} contentType - The MIME type of the uploaded file.
   */
  public fileUploaded(key: string, contentType: string) {
    this.logger.info({
      message: 'File Uploaded',
      bucketName: this.bucketName,
      key,
      contentType,
    });
  }

  /**
   * Logs a file retrieval event.
   *
   * @param {string} key - The object key (path) of the retrieved file.
   */
  public fileRetrieved(key: string) {
    this.logger.info({
      message: 'File Retrieved',
      bucketName: this.bucketName,
      key,
    });
  }

  /**
   * Logs a file deletion event.
   *
   * @param {string} key - The object key (path) of the deleted file.
   */
  public fileDeleted(key: string) {
    this.logger.info({
      message: 'File Deleted',
      bucketName: this.bucketName,
      key,
    });
  }

  /**
   * Logs a file listing event.
   *
   * @param {string[]} keys - The list of keys returned from the bucket.
   */
  public filesListed(keys: string[]) {
    this.logger.info({
      message: 'Files Listed',
      bucketName: this.bucketName,
      total: keys.length,
      keys,
    });
  }
}
