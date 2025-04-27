import { ILogger } from '../../../../../logger/contracts';
import { IResponseBuilder } from '../../../../../response-builder/contracts';
import { IErrorActions } from '../../../../contracts/i-error-actions';
import {
  MessageRejected,
  MailFromDomainNotVerifiedException,
  ConfigurationSetDoesNotExistException,
} from '@aws-sdk/client-ses';

/**
 * Handles AWS SES related errors and builds appropriate responses.
 *
 * @template T - Response type
 * @template R - Response builder type
 */
export class SESEmailErrorHandler<T, R extends IResponseBuilder<T>>
  implements IErrorActions<T, R>
{
  canHandle(error: Error): boolean {
    return (
      error instanceof MessageRejected ||
      error instanceof MailFromDomainNotVerifiedException ||
      error instanceof ConfigurationSetDoesNotExistException
    );
  }

  handle(error: Error, logger: ILogger<any>, resBuilder: R): T {
    const message = 'SES Email operation failed';

    if (error instanceof MessageRejected) {
      logger.error({
        description: `${message}: Message rejected`,
        name: error.name,
        message: error.message,
        details: `The email message was rejected. It could be due to content or address policies.`,
      });

      return resBuilder.badRequest('Email message was rejected by SES') as T;
    }

    if (error instanceof MailFromDomainNotVerifiedException) {
      logger.error({
        description: `${message}: Mail From domain not verified`,
        name: error.name,
        message: error.message,
        details: `The 'From' domain used in the email is not verified in SES.`,
      });

      return resBuilder.badRequest('Sender domain is not verified in SES') as T;
    }

    if (error instanceof ConfigurationSetDoesNotExistException) {
      logger.error({
        description: `${message}: Configuration set does not exist`,
        name: error.name,
        message: error.message,
        details: `The configuration set specified in the request does not exist.`,
      });

      return resBuilder.internalError(
        'SES configuration set does not exist',
      ) as T;
    }
  }
}
