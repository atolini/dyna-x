import {
  InternalServerError,
  InvalidEndpointException,
  ProvisionedThroughputExceededException,
  RequestLimitExceeded,
  ResourceNotFoundException,
} from '@aws-sdk/client-dynamodb';
import { IResponseBuilder } from '@response-builder/contracts';
import { ILogger } from '@logger/contracts';
import { IErrorActions } from '@error-handler/contracts';
import { InvalidKeyError } from '@database/schema/implementations/dynamo';

/**
 * @template T - Response type
 * @template R - Response builder type
 *
 * Handles a specific set of exceptions thrown during DynamoDB repository operations.
 *
 * This class provides centralized error handling for the following exceptions:
 *
 * - **InternalServerError**: An internal error occurred within the AWS DynamoDB service.
 * - **InvalidEndpointException**: The endpoint provided is invalid.
 * - **ProvisionedThroughputExceededException**: The request exceeded the provisioned throughput for the table.
 * - **RequestLimitExceeded**: The request limit for the account has been exceeded.
 * - **ResourceNotFoundException**: The specified table or index does not exist.
 */
export class DynamoErrorHandler<T, R extends IResponseBuilder<T>>
  implements IErrorActions<T, R>
{
  private readonly retryableErrors = new Set([
    InternalServerError,
    InvalidEndpointException,
    ProvisionedThroughputExceededException,
    RequestLimitExceeded,
    ResourceNotFoundException,
  ]);

  /**
   * Checks if the provided error is one of the handled DynamoDB exceptions.
   *
   * @param error - The error to check.
   * @returns True if the error can be handled by this handler, false otherwise.
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
   * @returns The response generated for the handled error.
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
        type: InvalidEndpointException,
        log: {},
        response: () =>
          resBuilder.internalError(
            'Invalid endpoint. Please check your configuration.',
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
