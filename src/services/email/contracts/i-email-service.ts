import { IEmailMessageInput } from './i-email-message-input';

/**
 * Defines a service for sending emails.
 *
 * The service allows sending emails using various methods (e.g., through SES or another email service provider).
 *
 * @interface IEmailService
 */
export interface IEmailService {
  /**
   * Sends an email.
   *
   * @param {IEmailMessageInput} message - The email message to be sent, containing recipient(s), subject, and body content.
   *
   * @returns {Promise<void>} A promise that resolves once the email is successfully sent.
   *
   * @example
   * const emailService: IEmailService = new SESEmailService('no-reply@example.com');
   * const message: EmailMessage = {
   *   to: 'recipient@example.com',
   *   subject: 'Subject of the email',
   *   bodyText: 'This is the plain text body.',
   *   bodyHtml: '<p>This is the HTML body.</p>',
   * };
   * emailService.sendEmail(message)
   *   .then(() => console.log('Email sent successfully!'))
   *   .catch((error) => console.error('Error sending email:', error));
   */
  sendEmail(message: IEmailMessageInput): Promise<void>;
}
