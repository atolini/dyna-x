import { ILogger } from '@logger/contracts';
import { IResponseBuilder } from '@response-builder/contracts';
import { IErrorActions } from '@error-handler/contracts';
import {
  MessageRejected,
  MailFromDomainNotVerifiedException,
  ConfigurationSetDoesNotExistException,
  AccountSendingPausedException,
  ConfigurationSetSendingPausedException,
} from '@aws-sdk/client-ses';

/**
 * @class SESEmailErrorHandler
 * @implements {IErrorActions<T, R>}
 * @template T - Response type
 * @template R - Response builder type
 *
 * @classdesc
 * Handles excetions thrown within the {@link SESEmailService} class.
 *
 * - **AccountSendingPausedException**: If the Amazon SES account is paused from sending emails.
 * - **ConfigurationSetDoesNotExistException**: If the specified configuration set does not exist.
 * - **ConfigurationSetSendingPausedException**: If the specified configuration set is paused from sending emails.
 * - **MailFromDomainNotVerifiedException**: If the sender's email address is not verified with Amazon SES.
 * - **MessageRejected**: If the email message is rejected by Amazon SES.
 */
export class SESEmailErrorHandler<T, R extends IResponseBuilder<T>>
  implements IErrorActions<T, R>
{
  /**
   *
   */
  canHandle(error: Error): boolean {
    return (
      error instanceof AccountSendingPausedException ||
      error instanceof ConfigurationSetDoesNotExistException ||
      error instanceof ConfigurationSetSendingPausedException ||
      error instanceof MailFromDomainNotVerifiedException ||
      error instanceof MessageRejected
    );
  }

  /**
   *
   */
  handle(error: Error, logger: ILogger<any>, resBuilder: R): T {
    const errorMap = [
      {
        /** Infra error */
        type: AccountSendingPausedException,
        log: {},
        response: () => resBuilder.internalError(),
      },
      {
        /** Infra error */
        type: ConfigurationSetDoesNotExistException,
        log: {},
        response: () => resBuilder.internalError(),
      },
      {
        /** Infra error */
        type: ConfigurationSetSendingPausedException,
        log: {},
        response: () => resBuilder.internalError(),
      },
      {
        /** Infra error */
        type: MailFromDomainNotVerifiedException,
        log: {},
        response: () => resBuilder.internalError(),
      },
      {
        /** Infra error */
        type: MessageRejected,
        log: {},
        response: () => resBuilder.internalError(),
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
