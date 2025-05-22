import {
  ConditionalCheckFailedException,
  InternalServerError,
  InvalidEndpointException,
  ItemCollectionSizeLimitExceededException,
  ProvisionedThroughputExceededException,
  ReplicatedWriteConflictException,
  RequestLimitExceeded,
  ResourceNotFoundException,
  TransactionConflictException,
} from '@aws-sdk/client-dynamodb';
import { IResponseBuilder } from '@response-builder/contracts';
import { ILogger } from '@logger/contracts';
import { IErrorActions } from '@error-handler/contracts';

/**
 * @class DynamoWriteErrorHandler
 * @implements {IErrorActions<T, R>}
 * @template T - Response type
 * @template R - Response builder type
 *
 * @classdesc
 * Handles exceptions thrown during DynamoDB write operations.
 *
 * This class provides centralized error handling for the following exceptions:
 *
 * - **ConditionalCheckFailedException**: A condition specified in the operation was not met.
 * - **InternalServerError**: An internal error occurred within the AWS DynamoDB service.
 * - **InvalidEndpointException**: The endpoint provided is invalid.
 * - **ItemCollectionSizeLimitExceededException**: The item collection size limit has been exceeded.
 * - **ProvisionedThroughputExceededException**: The request exceeded the provisioned throughput for the table.
 * - **ReplicatedWriteConflictException**: A conflict occurred during a replicated write operation.
 * - **RequestLimitExceeded**: The request limit for the account has been exceeded.
 * - **ResourceNotFoundException**: The specified table or index does not exist.
 * - **TransactionConflictException**: A conflict occurred during a transactional operation.
 */
export class DynamoWriteErrorHandler<T, R extends IResponseBuilder<T>>
  implements IErrorActions<T, R>
{
  private readonly handledErrors = new Set([
    ConditionalCheckFailedException,
    InternalServerError,
    InvalidEndpointException,
    ItemCollectionSizeLimitExceededException,
    ProvisionedThroughputExceededException,
    ReplicatedWriteConflictException,
    RequestLimitExceeded,
    ResourceNotFoundException,
    TransactionConflictException,
  ]);

  /**
   * Checks if the provided error is one of the handled DynamoDB exceptions.
   *
   * @param error - The error to check.
   * @returns True if the error can be handled by this handler, false otherwise.
   */
  canHandle(error: Error): boolean {
    return Array.from(this.handledErrors).some(
      (errorType) => error instanceof errorType,
    );
  }

  /**
   * Handles the provided error by logging it and returning an appropriate response using the response builder.
   *
   * @param error - The error to handle.
   * @param logger - The logger instance used to log the error details.
   * @param resBuilder - The response builder used to generate the response.
   * @returns The response generated for the handled error.
   */
  handle(error: Error, logger: ILogger<any>, resBuilder: R): T {
    const errorMap = [
      {
        type: ConditionalCheckFailedException,
        response: () =>
          resBuilder.badRequest(
            'Conditional check failed. Please check the request parameters.'
          ),
      },
      {
        type: InternalServerError,
        response: () =>
          resBuilder.internalError(
            'An internal server error occurred. Please try again later.'
          ),
      },
      {
        type: InvalidEndpointException,
        response: () =>
          resBuilder.internalError(
            'Invalid endpoint. Please check your configuration.'
          ),
      },
      {
        type: ItemCollectionSizeLimitExceededException,
        response: () =>
          resBuilder.tooManyRequests(
            'Item collection size limit exceeded. Please try again later.'
          ),
      },
      {
        type: ProvisionedThroughputExceededException,
        response: () =>
          resBuilder.tooManyRequests(
            'Provisioned throughput exceeded. Please try again later.'
          ),
      },
      {
        type: ReplicatedWriteConflictException,
        response: () =>
          resBuilder.tooManyRequests(
            'Replicated write conflict. Please try again later.'
          ),
      },
      {
        type: RequestLimitExceeded,
        response: () =>
          resBuilder.tooManyRequests(
            'Request limit exceeded. Please try again later.'
          ),
      },
      {
        type: ResourceNotFoundException,
        response: () =>
          resBuilder.notFound('The specified resource was not found.'),
      },
      {
        type: TransactionConflictException,
        response: () =>
          resBuilder.tooManyRequests(
            'Transaction conflict. Please try again later.'
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