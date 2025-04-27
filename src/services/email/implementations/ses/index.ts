import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { IEmailService, EmailMessage } from '../../contracts';

/**
 * AWS SES implementation of the IEmailService interface for sending emails.
 *
 * This service uses Amazon Simple Email Service (SES) to send emails. The service can send text
 * and HTML formatted emails to one or more recipients. It allows specifying a custom sender email address
 * or defaults to the provided default sender.
 *
 * @implements {IEmailService}
 */
export class SESEmailService implements IEmailService {
  private sesClient: SESClient;
  private defaultSender: string;

  /**
   * Creates an instance of SESEmailService.
   *
   * @param {string} defaultSender - The default sender email address.
   * @param {string} [region] - Optional AWS region to use for SES. If not provided, the default region is used.
   */
  constructor(defaultSender: string, region?: string) {
    this.sesClient = new SESClient(region ? { region } : {});
    this.defaultSender = defaultSender;
  }

  /**
   * Sends an email using AWS SES.
   *
   * @param {EmailMessage} message - The message to be sent, containing recipient(s), subject, and body content.
   * @returns {Promise<void>} A promise that resolves once the email is sent.
   *
   * @example
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
   */
  async sendEmail(message: EmailMessage): Promise<void> {
    const { to, subject, bodyText, bodyHtml, from } = message;

    const destination = Array.isArray(to) ? to : [to];
    const sender = from || this.defaultSender;

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
  }
}
