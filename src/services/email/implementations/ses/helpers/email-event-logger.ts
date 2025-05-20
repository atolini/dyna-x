import { ILogger } from '../../../../logger/contracts';
import { EmailMessage } from '../../../contracts';

/**
 * @class EmailEventLogger
 * @classdesc
 * Helper class responsible for logging email-related events performed by the {@link SESEmailService}.
 *
 * Logs successful and failed email deliveries in a structured format using the provided logger instance.
 *
 * This logger focuses on capturing key email events for observability and auditability.
 *
 * @example
 * const logger = new ConsoleLogger(); // implements ILogger
 * const eventLogger = new EmailEventLogger(logger, 'no-reply@example.com');
 * eventLogger.emailSent(message);
 */
export class EmailEventLogger {
  private readonly logger: ILogger<unknown>;
  private readonly defaultSender: string;

  /**
   * Creates an instance of EmailEventLogger.
   *
   * @param {ILogger<any>} logger - A logger instance that implements the ILogger interface.
   * @param {string} defaultSender - The default email sender used by the SESEmailService.
   */
  constructor(logger: ILogger<unknown>, defaultSender: string) {
    this.logger = logger;
    this.defaultSender = defaultSender;
  }

  /**
   * Logs a successful email sending event.
   *
   * @param {EmailMessage} message - The message that was sent.
   */
  public emailSent(message: EmailMessage) {
    this.logger.info({
      message: 'Email Sent',
      sender: message.from || this.defaultSender,
      recipients: Array.isArray(message.to) ? message.to : [message.to],
      subject: message.subject,
    });
  }
}
