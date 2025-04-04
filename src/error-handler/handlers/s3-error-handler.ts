import { Logger } from "@aws-lambda-powertools/logger";
import { IResponseBuilder } from "@response-builder/i-response-builder";
import { ErrorActions } from "../error-actions";
import { S3FileNotFoundError } from "@storage-service/s3-file-not-found-error";
import { NoSuchBucket } from "@aws-sdk/client-s3";

/**
 * Handles S3-related errors and builds appropriate responses.
 *
 * @template T - Response type
 * @template R - Response builder type
 */
export class S3ErrorHandler<T, R extends IResponseBuilder<T>> implements ErrorActions<T, R> {
  canHandle(error: Error): boolean {
    return (
      error instanceof S3FileNotFoundError ||
      error instanceof NoSuchBucket 
    );
  }

  handle(error: Error, logger: Logger, resBuilder: R): T {
    const message = "S3 operation failed";
  
    if (error instanceof S3FileNotFoundError) {
      logger.error(`${message}: File not found in S3`, {
        name: error.name,
        message: error.message,
        details: `The object with key "${error.key}" was not found in the S3 bucket.`,
      });
  
      return resBuilder.notFound(error.message) as T;
    }
  
    if (error instanceof NoSuchBucket) {
      logger.error(`${message}: Bucket not found`, {
        name: error.name,
        message: error.message,
        details: `The specified S3 bucket may be missing, deleted, or the name is incorrect.`,
      });
  
      return resBuilder.internalError("S3 bucket does not exist") as T;
    }
  }  
}
