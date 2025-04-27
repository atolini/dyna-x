import { ILogger } from '../../../../../logger/contracts';
import { IResponseBuilder } from '../../../../../response-builder/contracts';
import { IErrorActions } from '../../../../contracts/i-error-actions';
import {
  ResourceNotFoundException,
  InvalidSequenceTokenException,
  DataAlreadyAcceptedException,
} from '@aws-sdk/client-cloudwatch-logs';

/**
 * Handles AWS CloudWatch Logs related errors and builds appropriate responses.
 *
 * @template T - Response type
 * @template R - Response builder type
 */
export class CloudWatchLogErrorHandler<T, R extends IResponseBuilder<T>>
  implements IErrorActions<T, R>
{
  canHandle(error: Error): boolean {
    return (
      error instanceof ResourceNotFoundException ||
      error instanceof InvalidSequenceTokenException ||
      error instanceof DataAlreadyAcceptedException
    );
  }

  handle(error: Error, logger: ILogger<any>, resBuilder: R): T {
    const message = 'CloudWatch Logs operation failed';

    if (error instanceof ResourceNotFoundException) {
      logger.error({
        description: `${message}: Resource not found`,
        name: error.name,
        message: error.message,
        details: `The specified log group or log stream does not exist.`,
      });

      return resBuilder.notFound('Log group or log stream not found') as T;
    }

    if (error instanceof InvalidSequenceTokenException) {
      logger.error({
        description: `${message}: Invalid sequence token`,
        name: error.name,
        message: error.message,
        details: `The sequence token provided is invalid. Possibly the log stream has received newer events.`,
      });

      return resBuilder.badRequest(
        'Invalid sequence token for log stream',
      ) as T;
    }

    if (error instanceof DataAlreadyAcceptedException) {
      logger.error({
        description: `${message}: Data already accepted`,
        name: error.name,
        message: error.message,
        details: `The event data was already accepted. This can happen when retrying without updating the sequence token.`,
      });

      return resBuilder.badRequest('Log event data was already accepted') as T;
    }
  }
}
