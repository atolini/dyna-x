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
import { InvalidKeyError } from '@database/schema/implementations/dynamo';

/**
 * @template T - Response type
 * @template R - Response builder type
 *
 * Handles specific exceptions thrown within the {@link DynamoTransactionWrite} class during DynamoDB transactional operations.
 *
 * This class provides centralized error handling for the following DynamoDB exceptions:
 *
 * - {@link IdempotentParameterMismatchException}: Retry with a mismatched client token and parameters.
 * - {@link InternalServerError}: An internal error occurred within the AWS DynamoDB service.
 * - {@link InvalidEndpointException}: The DynamoDB endpoint is incorrect or unavailable.
 * - {@link ProvisionedThroughputExceededException}: The request exceeded the provisioned throughput for the table.
 * - {@link RequestLimitExceeded}: The request limit for the account has been exceeded.
 * - {@link ResourceNotFoundException}: The specified table or index does not exist.
 * - {@link TransactionCanceledException}: The transaction was canceled.
 * - {@link TransactionInProgressException}: Another transaction is currently in progress.
 */
export class DynamoTransactionWriterErrorHandler<
  T,
  R extends IResponseBuilder<T>,
> implements IErrorActions<T, R>
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
   * Checks if the provided error is one of the handled DynamoDB exceptions.
   *
   * @param error - The error to check.
   * @returns {boolean} True if the error can be handled by this handler, false otherwise.
   */
  canHandle(error: Error): boolean {
    return Array.from(this.retryableErrors).some(
      (errorType) => error instanceof errorType,
    );
  }

  /**
   * Handles the provided error by logging it and returning an appropriate response using the response builder.
   *
   * @param error - The error to handle.
   * @param logger - The logger instance used to log the error details.
   * @param resBuilder - The response builder used to generate the response.
   * @returns {T} The response generated for the handled error.
   */
  handle(error: Error, logger: ILogger<any>, resBuilder: R): T {
    const errorMap = [
      {
        type: IdempotentParameterMismatchException,
        response: () =>
          resBuilder.badRequest(
            'Idempotent parameter mismatch. Please check the request parameters.',
          ),
      },
      {
        type: InternalServerError,
        response: () =>
          resBuilder.internalError(
            'An internal server error occurred. Please try again later.',
          ),
      },
      {
        type: InvalidEndpointException,
        response: () =>
          resBuilder.internalError(
            'Invalid endpoint. Please check your DynamoDB configuration.',
          ),
      },
      {
        type: ProvisionedThroughputExceededException,
        response: () =>
          resBuilder.tooManyRequests(
            'Provisioned throughput exceeded. Please try again later.',
          ),
      },
      {
        type: RequestLimitExceeded,
        response: () =>
          resBuilder.tooManyRequests(
            'Request limit exceeded. Please try again later.',
          ),
      },
      {
        type: ResourceNotFoundException,
        response: () =>
          resBuilder.notFound('The specified resource was not found.'),
      },
      {
        type: TransactionCanceledException,
        response: () =>
          resBuilder.badRequest(
            'Transaction canceled. Please check the request parameters.',
          ),
      },
      {
        type: TransactionInProgressException,
        response: () =>
          resBuilder.tooManyRequests(
            'Transaction in progress. Please try again later.',
          ),
      },
      {
        type: InvalidKeyError,
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
        return entry.response();
      }
    }
  }
}
