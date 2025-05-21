import { IEmailMessage } from './i-email-message';

/**
 * @interface IEmailServiceEventLogger
 * @description Interface for logging email-related events.
 */
export interface IEmailServiceEventLogger {
  /**
   * Logs a successful email sending event.
   *
   * @param {IEmailMessage} message - The message that was sent.
   */
  emailSent(message: IEmailMessage): void;
}
