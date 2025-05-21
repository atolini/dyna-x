import { IEmailMessageInput } from './i-email-message-input';

/**
 * @interface IEmailServiceEventLogger
 * @description Interface for logging email-related events.
 */
export interface IEmailServiceEventLogger {
  /**
   * Logs a successful email sending event.
   *
   * @param {IEmailMessageInput} message - The message that was sent.
   */
  emailSent(message: IEmailMessageInput): void;
}
