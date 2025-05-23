import { InvalidParameterException } from '@aws-sdk/client-cognito-identity-provider';
import { ILogger } from '@logger/contracts';
import { IResponseBuilder } from '@response-builder/contracts';
import { IErrorActions } from '@error-handler/contracts';
import {
  ResourceNotFoundException,
  InvalidSequenceTokenException,
  DataAlreadyAcceptedException,
  ServiceUnavailableException,
  UnrecognizedClientException,
} from '@aws-sdk/client-cloudwatch-logs';

/**
 * @template T - Response type
 * @template R - Response builder type
 *
 * Handles exceptions thrown within the {@link CloudWatchLogService} class.
 *
 * This class is responsible for identifying and handling specific AWS CloudWatch
 * logging-related errors and returning meaningful HTTP responses using a response builder.
 *
 * The following exceptions may be handled by this class:
 * - **DataAlreadyAcceptedException**: If the logs are already accepted.
 * - **InvalidParameterException**: If the parameters are invalid.
 * - **InvalidSequenceTokenException**: If the sequence token is invalid.
 * - **ResourceNotFoundException**: If the specified log group or log stream does not exist.
 * - **ServiceUnavailableException**: If the service is unavailable.
 * - **UnrecognizedClientException**: If the client is unrecognized.
 */
export class CloudWatchLogServiceErrorHandler<T, R extends IResponseBuilder<T>>
  implements IErrorActions<T, R>
{
  /**
   * Checks if the provided error can be handled by this error handler.
   *
   * @param {Error} error - The error object thrown during log submission.
   * @returns {boolean} Returns `true` if the error is one of the known CloudWatch log-related exceptions.
   */
  canHandle(error: Error): boolean {
    return (
      error instanceof DataAlreadyAcceptedException ||
      error instanceof InvalidParameterException ||
      error instanceof InvalidSequenceTokenException ||
      error instanceof ResourceNotFoundException ||
      error instanceof ServiceUnavailableException ||
      error instanceof UnrecognizedClientException
    );
  }

  /**
   * Handles the provided error by logging its details and returning an appropriate response using the response builder.
   *
   * @param {Error} error - The error to handle.
   * @param {ILogger<any>} logger - Logger instance used to log error details.
   * @param {R} resBuilder - Response builder used to construct the final response.
   * @returns {T} A structured response indicating the error condition.
   *
   */
  handle(error: Error, logger: ILogger<any>, resBuilder: R): T {
    if (error instanceof ResourceNotFoundException) {
      logger.error({ name: error.name, message: error.message });
      return resBuilder.notFound('Log group or log stream not found');
    }

    if (error instanceof InvalidSequenceTokenException) {
      logger.error({ name: error.name, message: error.message });
      return resBuilder.badRequest('Invalid sequence token for log stream');
    }

    if (error instanceof DataAlreadyAcceptedException) {
      logger.error({ name: error.name, message: error.message });
      return resBuilder.badRequest('Log event data was already accepted');
    }

    if (error instanceof InvalidParameterException) {
      logger.error({ name: error.name, message: error.message });
      return resBuilder.badRequest('Invalid parameter for log request');
    }

    if (error instanceof ServiceUnavailableException) {
      logger.error({ name: error.name, message: error.message });
      return resBuilder.internalError(
        'CloudWatch Logs service is temporarily unavailable',
      );
    }

    if (error instanceof UnrecognizedClientException) {
      logger.error({ name: error.name, message: error.message });
      return resBuilder.forbidden('AWS client is not recognized');
    }
  }
}
