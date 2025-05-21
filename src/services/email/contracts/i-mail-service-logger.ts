import { IEmailMessage } from './i-email-message';

/**
 * @interface IEmailEventLogger
 * @description Interface for logging email-related events.
 */
export interface IEmailEventLogger {
  /**
   * Logs a successful email sending event.
   *
   * @param {IEmailMessage} message - The message that was sent.
   */
  emailSent(message: IEmailMessage): void;
}
