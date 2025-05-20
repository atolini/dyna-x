import { InvalidParameterException } from '@aws-sdk/client-cognito-identity-provider';
import { ILogger } from '../../../../../services/logger/contracts';
import { IResponseBuilder } from '../../../../response-builder/contracts';
import { IErrorActions } from '../../../contracts/i-error-actions';
import {
  ResourceNotFoundException,
  InvalidSequenceTokenException,
  DataAlreadyAcceptedException,
  ServiceUnavailableException,
  UnrecognizedClientException,
} from '@aws-sdk/client-cloudwatch-logs';

/**
 * @class CloudWatchLogErrorHandler
 * @implements {IErrorActions<T, R>}
 * @template T - Response type
 * @template R - Response builder type
 *
 * @classdesc
 * Handles exceptions thrown within the {@link CloudWatchLogService} class.
 *
 * The following exceptions may be handled by this class:
 * - **DataAlreadyAcceptedException**: If the logs are already accepted.
 * - **InvalidParameterException**: If the parameters are invalid.
 * - **InvalidSequenceTokenException**: If the sequence token is invalid.
 * - **ResourceNotFoundException**: If the specified log group or log stream does not exist.
 * - **ServiceUnavailableException**: If the service is unavailable.
 * - **UnrecognizedClientException**: If the client is unrecognized.
 */
export class CloudWatchLogErrorHandler<T, R extends IResponseBuilder<T>>
  implements IErrorActions<T, R>
{
  /**
   *
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
   *
   */
  handle(error: Error, logger: ILogger<any>, resBuilder: R): T {
    if (error instanceof ResourceNotFoundException) {
      logger.error({ name: error.name, message: error.message });
      return resBuilder.notFound('Log group or log stream not found') as T;
    }

    if (error instanceof InvalidSequenceTokenException) {
      logger.error({ name: error.name, message: error.message });
      return resBuilder.badRequest(
        'Invalid sequence token for log stream',
      ) as T;
    }

    if (error instanceof DataAlreadyAcceptedException) {
      logger.error({ name: error.name, message: error.message });
      return resBuilder.badRequest('Log event data was already accepted') as T;
    }

    if (error instanceof InvalidParameterException) {
      logger.error({ name: error.name, message: error.message });
      return resBuilder.badRequest('Invalid parameter for log request') as T;
    }

    if (error instanceof ServiceUnavailableException) {
      logger.error({ name: error.name, message: error.message });
      return resBuilder.internalError(
        'CloudWatch Logs service is temporarily unavailable',
      ) as T;
    }

    if (error instanceof UnrecognizedClientException) {
      logger.error({ name: error.name, message: error.message });
      return resBuilder.internalError('AWS client is not recognized') as T;
    }
  }
}
