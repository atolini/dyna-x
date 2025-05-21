import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { IEmailService } from '@email/contracts/i-email-service';
import { IEmailMessage } from '@email/contracts/i-email-message';
import { IEmailServiceEventLogger } from '@email/contracts/i-email-service-event-logger';

/**
 * @class SESEmailService
 * @implements {IEmailService}
 *
 * @classdesc
 * AWS SES implementation of the IEmailService interface for sending emails.
 *
 * This service uses Amazon Simple Email Service (SES) to send emails. The service can send text
 * and HTML formatted emails to one or more recipients. It allows specifying a custom sender email address
 * or defaults to the provided default sender.
 *
 * @example
 * // Example 1: Create a service with a default sender and send a basic text email
 * const emailService = new SESEmailService('no-reply@example.com', 'us-east-1');
 *
 * const message = {
 *   to: 'recipient@example.com',
 *   subject: 'Hello from SES',
 *   bodyText: 'This is a plain text email.',
 * };
 *
 * await emailService.sendEmail(message);
 *
 * @example
 * // Example 2: Send an email with both text and HTML content and a custom sender
 * const emailService = new SESEmailService('no-reply@example.com');
 *
 * const message = {
 *   to: ['user1@example.com', 'user2@example.com'],
 *   subject: 'Welcome Email',
 *   bodyText: 'Welcome to our platform!',
 *   bodyHtml: '<h1>Welcome to our platform!</h1><p>We are glad to have you.</p>',
 *   from: 'support@example.com',
 * };
 *
 * await emailService.sendEmail(message);
 */
export class SESEmailService implements IEmailService {
  private sesClient: SESClient;
  private defaultSender: string;
  private eventLogger: IEmailServiceEventLogger;

  /**
   * Creates an instance of SESEmailService.
   *
   * @param {string} defaultSender - The default sender email address.
   * @param {string} [region] - Optional AWS region to use for SES. If not provided, the default region is used.
   */
  constructor(
    defaultSender: string,
    eventLogger: IEmailServiceEventLogger,
    region?: string,
  ) {
    this.sesClient = new SESClient(region ? { region } : {});
    this.defaultSender = defaultSender;
    this.eventLogger = eventLogger;
  }

  /**
   * Sends an email using AWS SES.
   *
   * @param {IEmailMessage} message - The message to be sent, containing recipient(s), subject, and body content.
   * @returns {Promise<void>} A promise that resolves once the email is sent.
   *
   * @example
   * // Sending a basic text email.
   * const emailService = new SESEmailService('no-reply@example.com');
   * const message = {
   *   to: 'recipient@example.com',
   *   subject: 'Hello from SES',
   *   bodyText: 'This is a text email body.',
   *   bodyHtml: '<p>This is an HTML email body.</p>',
   *   from: 'sender@example.com',
   * };
   * emailService.sendEmail(message)
   *   .then(() => console.log('Email sent successfully!'))
   *   .catch((error) => console.error('Error sending email:', error));
   *
   * @example
   * // Sending email without a custom sender (uses the default sender).
   * const message = {
   *   to: 'recipient@example.com',
   *   subject: 'Test Email',
   *   bodyText: 'This is a test email.',
   * };
   * emailService.sendEmail(message)
   *   .then(() => console.log('Email sent successfully!'))
   *   .catch((error) => console.error('Error sending email:', error));
   *
   * @throws {AccountSendingPausedException} If the Amazon SES account is paused from sending emails.
   * @throws {ConfigurationSetDoesNotExistException} If the specified configuration set does not exist.
   * @throws {ConfigurationSetSendingPausedException} If the specified configuration set is paused from sending emails.
   * @throws {MailFromDomainNotVerifiedException} If the sender's email address is not verified with Amazon SES.
   * @throws {MessageRejected} If the email message is rejected by Amazon SES.
   *
   * This function uses the AWS SDK command:
   * {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/ses/command/SendEmailCommand/ | SendEmailCommand}
   */
  async sendEmail(message: IEmailMessage): Promise<void> {
    const { to, subject, bodyText, bodyHtml, from } = message;

    const destination = Array.isArray(to) ? to : [to];
    const sender = from || this.defaultSender;

    message.from = sender;

    const command = new SendEmailCommand({
      Source: sender,
      Destination: {
        ToAddresses: destination,
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8',
        },
        Body: {
          Text: bodyText ? { Data: bodyText, Charset: 'UTF-8' } : undefined,
          Html: bodyHtml ? { Data: bodyHtml, Charset: 'UTF-8' } : undefined,
        },
      },
    });

    await this.sesClient.send(command);

    this.eventLogger.emailSent(message);
  }
}
