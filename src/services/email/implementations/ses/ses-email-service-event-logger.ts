import { ILogger } from '@logger/contracts';
import { IEmailMessageInput } from '@email/contracts/i-email-message-input';

/**
 * @class SESEmailServiceEventLogger
 * @classdesc
 * Helper class responsible for logging email-related events performed by the {@link SESEmailService}.
 *
 * Logs successful and failed email deliveries in a structured format using the provided logger instance.
 *
 * This logger focuses on capturing key email events for observability and auditability.
 *
 * @example
 * const logger = new ConsoleLogger(); // implements ILogger
 * const eventLogger = new SESEmailServiceEventLogger(logger, 'no-reply@example.com');
 * eventLogger.emailSent(message);
 */
export class SESEmailServiceEventLogger {
  private readonly logger: ILogger<unknown>;

  /**
   * Creates an instance of EmailEventLogger.
   *
   * @param {ILogger<any>} logger - A logger instance that implements the ILogger interface.
   */
  constructor(logger: ILogger<unknown>) {
    this.logger = logger;
  }

  /**
   * Logs a successful email sending event.
   *
   * @param {IEmailMessageInput} message - The message that was sent.
   */
  public emailSent(message: IEmailMessageInput) {
    this.logger.info({
      message: 'Email Sent',
      sender: message.from || 'undefined',
      recipients: Array.isArray(message.to) ? message.to : [message.to],
      subject: message.subject,
    });
  }
}
