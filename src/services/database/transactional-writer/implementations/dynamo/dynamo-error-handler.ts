import {
  IdempotentParameterMismatchException,
  InternalServerError,
  InvalidEndpointException,
  ProvisionedThroughputExceededException,
  RequestLimitExceeded,
  ResourceNotFoundException,
  TransactionCanceledException,
  TransactionInProgressException,
} from '@aws-sdk/client-dynamodb';
import { IResponseBuilder } from '@response-builder/contracts';
import { ILogger } from '@logger/contracts';
import { IErrorActions } from '@error-handler/contracts';

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
 * - **IdempotentParameterMismatchException**: Retry with a mismatched client token and parameters.
 * - **TransactionCanceledException**: The transaction was canceled.
 * - **TransactionInProgressException**: Another transaction is currently in progress.
 * - **InvalidEndpointException**: The DynamoDB endpoint is incorrect or unavailable.
 */
export class DynamoErrorHandler<T, R extends IResponseBuilder<T>>
  implements IErrorActions<T, R>
{
  private readonly retryableErrors = new Set([
    IdempotentParameterMismatchException,
    InternalServerError,
    InvalidEndpointException,
    ProvisionedThroughputExceededException,
    RequestLimitExceeded,
    ResourceNotFoundException,
    TransactionCanceledException,
    TransactionInProgressException,
  ]);

  /**
   *
   */
  canHandle(error: Error): boolean {
    return Array.from(this.retryableErrors).some(
      (errorType) => error instanceof errorType,
    );
  }

  /**
   *
   */
  handle(error: Error, logger: ILogger<any>, resBuilder: R): T {
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
        type: InvalidEndpointException,
        log: {},
        response: () =>
          resBuilder.internalError(
            'Invalid endpoint. Please check your DynamoDB configuration.',
          ),
      },
    ];

    for (const entry of errorMap) {
      if (error instanceof entry.type) {
        logger.error({
          name: error.name,
          message: error.message,
        });

        return entry.response();
      }
    }
  }
}
