import {
  ConditionalCheckFailedException,
  ProvisionedThroughputExceededException,
  RequestLimitExceeded,
  ItemCollectionSizeLimitExceededException,
  InternalServerError,
  ResourceNotFoundException,
  TransactionConflictException,
  IdempotentParameterMismatchException,
  TransactionCanceledException,
  TransactionInProgressException,
} from '@aws-sdk/client-dynamodb';
import { IErrorActions } from '../../../../contracts/i-error-actions';
import { IResponseBuilder } from '../../../../../response-builder/contracts';
import { ILogger } from '../../../../../logger/contracts';
import { MaxItemsExceededError } from '../../../../../../services/database/implementations/dyna-x/errors/max-item-exceeded-error';
import { InvalidKeyError } from '../../../../../../services/database/implementations/dyna-x/schema';

/**
 * @class DynamoErrorHandler
 * @implements {IErrorActions<T, R>}
 * @template T - Response type
 * @template R - Response builder type
 *
 * @classdesc
 * Handles exceptions thrown within the {@link DynaXTransactionWrite} and {@link DynaXRepository} classes.
 *
 * This class provides centralized error handling for various exceptions that may arise
 * during DynamoDB transactional and repository operations.
 *
 * The following exceptions may be handled:
 *
 * - **InternalServerError**: An internal error occurred within the AWS DynamoDB service.
 * - **ProvisionedThroughputExceededException**: The request exceeded the provisioned throughput for the table.
 * - **RequestLimitExceeded**: The request limit for the account has been exceeded.
 * - **ResourceNotFoundException**: The specified table or index does not exist.
 * - **ItemCollectionSizeLimitExceededException**: The item collection size limit has been exceeded (typically for local secondary indexes).
 * - **TransactionConflictException**: A conflict occurred during a transactional operation.
 * - **ConditionalCheckFailedException**: A condition specified in the operation was not met.
 * - **MaxItemsExceededError**: The number of items exceeded the allowed maximum batch size.
 * - **IdempotentParameterMismatchException**: A transaction was retried with the same client token but different parameters within the 10-minute idempotency window.
 * - **TransactionCanceledException**: The transaction was canceled, possibly due to a condition check failure or other reasons.
 * - **TransactionInProgressException**: Another transaction is already in progress.
 * - **InvalidKeyError**: One or more items had invalid keys according to the schema.
 */
export class DynamoErrorHandler<T, R extends IResponseBuilder<T>>
  implements IErrorActions<T, R>
{
  private readonly retryableErrors = new Set([
    InternalServerError,
    ProvisionedThroughputExceededException,
    RequestLimitExceeded,
    ResourceNotFoundException,
    ItemCollectionSizeLimitExceededException,
    TransactionConflictException,
    ConditionalCheckFailedException,
    MaxItemsExceededError,
    IdempotentParameterMismatchException,
    TransactionCanceledException,
    TransactionInProgressException,
    InvalidKeyError,
  ]);

  canHandle(error: Error): boolean {
    return Array.from(this.retryableErrors).some(
      (errorType) => error instanceof errorType,
    );
  }

  handle(error: Error, logger: ILogger<any>, resBuilder: R): T {
    const message = 'DynamoDB operation failed';
    const errorMap = [
      {
        type: InternalServerError,
        log: {},
        response: () =>
          resBuilder.internalError(
            'An internal server error occurred. Please try again later.',
          ),
      },
      {
        type: ProvisionedThroughputExceededException,
        log: {},
        response: () =>
          resBuilder.tooManyRequests(
            'Provisioned throughput exceeded. Please try again later.',
          ),
      },
      {
        type: RequestLimitExceeded,
        log: {},
        response: () =>
          resBuilder.tooManyRequests(
            'Request limit exceeded. Please try again later.',
          ),
      },
      {
        type: ResourceNotFoundException,
        log: {},
        response: () =>
          resBuilder.notFound('The specified resource was not found.'),
      },
      {
        type: ItemCollectionSizeLimitExceededException,
        log: {},
        response: () =>
          resBuilder.tooManyRequests(
            'Item collection size limit exceeded. Please try again later.',
          ),
      },
      {
        type: TransactionConflictException,
        log: {},
        response: () =>
          resBuilder.tooManyRequests(
            'Transaction conflict. Please try again later.',
          ),
      },
      {
        type: ConditionalCheckFailedException,
        log: {},
        response: () =>
          resBuilder.badRequest(
            'Conditional check failed. Please check the request parameters.',
          ),
      },
      {
        type: MaxItemsExceededError,
        log: {},
        response: () =>
          resBuilder.badRequest(
            'Max items exceeded. Please check the request parameters.',
          ),
      },
      {
        type: IdempotentParameterMismatchException,
        log: {},
        response: () =>
          resBuilder.badRequest(
            'Idempotent parameter mismatch. Please check the request parameters.',
          ),
      },
      {
        type: TransactionCanceledException,
        log: {},
        response: () =>
          resBuilder.badRequest(
            'Transaction canceled. Please check the request parameters.',
          ),
      },
      {
        type: TransactionInProgressException,
        log: {},
        response: () =>
          resBuilder.tooManyRequests(
            'Transaction in progress. Please try again later.',
          ),
      },
      {
        type: InvalidKeyError,
        log: {},
        response: () =>
          resBuilder.badRequest(
            'Invalid key. Please check the request parameters.',
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
