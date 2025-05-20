import { ILogger } from '../../../../logger/contracts';
import { IResponseBuilder } from '../../../../response-builder/contracts';
import { IErrorActions } from '../../../contracts/i-error-actions';
import {
  EncryptionTypeMismatch,
  InvalidObjectState,
  InvalidRequest,
  NoSuchBucket,
  NoSuchKey,
} from '@aws-sdk/client-s3';

/**
 * @class S3ErrorHandler
 * @implements {IErrorActions<T, R>}
 * @template T - Response type
 * @template R - Response builder type
 *
 * @classdesc
 * Handles excetions thrown within the {@link S3StorageService} class.
 *
 * The following exceptions may be handled:
 * - **EncryptionTypeMismatch**: The specified encryption type does not match the bucket's default encryption.
 * - **InvalidRequest**: 	The request is invalid. This can occur for various malformed or unsupported actions.
 * - **NoSuchKey**: The specified key does not exist in the bucket.
 * - **NoSuchBucket**: The specified bucket does not exist.
 * - **InvalidObjectState**: The operation is not valid for the object's storage class.
 */
export class S3ErrorHandler<T, R extends IResponseBuilder<T>>
  implements IErrorActions<T, R>
{
  /**
   *
   */
  canHandle(error: Error): boolean {
    return (
      error instanceof EncryptionTypeMismatch ||
      error instanceof InvalidRequest ||
      error instanceof NoSuchKey ||
      error instanceof NoSuchBucket ||
      error instanceof InvalidObjectState
    );
  }

  /**
   *
   */
  handle(error: Error, logger: ILogger<any>, resBuilder: R): T {
    const errorMap = [
      {
        type: EncryptionTypeMismatch,
        log: {},
        response: () =>
          resBuilder.badRequest(
            "The specified encryption type does not match the bucket's default encryption.",
          ),
      },
      {
        type: InvalidRequest,
        log: {},
        response: () =>
          resBuilder.badRequest(
            'The request is invalid. Please check the request parameters.',
          ),
      },
      {
        type: NoSuchKey,
        log: {},
        response: () =>
          resBuilder.notFound(
            'The specified key does not exist in the bucket.',
          ),
      },
      {
        type: NoSuchBucket,
        log: {},
        response: () =>
          resBuilder.notFound('The specified bucket does not exist.'),
      },
      {
        type: InvalidObjectState,
        log: {},
        response: () =>
          resBuilder.badRequest(
            "The operation is not valid for the object's storage class.",
          ),
      },
    ];

    for (const entry of errorMap) {
      if (error instanceof entry.type) {
        logger.error({
          name: error.name,
          message: error.message,
        });
        return entry.response() as T;
      }
    }
  }
}
