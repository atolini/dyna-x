/**
 * Represents an email message to be sent.
 *
 * This interface defines the structure of an email message, including the recipient(s), subject,
 * and optional body content in both text and HTML formats.
 *
 * @interface EmailMessage
 */
export interface EmailMessage {
  /**
   * The recipient(s) of the email. Can be a single email address or an array of email addresses.
   *
   * @type {string | string[]}
   */
  to: string | string[];

  /**
   * The subject of the email.
   *
   * @type {string}
   */
  subject: string;

  /**
   * The plain text body of the email.
   *
   * This field is optional and can be omitted if the email is to be sent in HTML format only.
   *
   * @type {string | undefined}
   */
  bodyText?: string;

  /**
   * The HTML body of the email.
   *
   * This field is optional and can be omitted if the email is to be sent in plain text format only.
   *
   * @type {string | undefined}
   */
  bodyHtml?: string;

  /**
   * The sender of the email.
   *
   * If not provided, the email service will use the default sender defined in the service configuration.
   *
   * @type {string | undefined}
   */
  from?: string;
}

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
   * @param {EmailMessage} message - The email message to be sent, containing recipient(s), subject, and body content.
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
  sendEmail(message: EmailMessage): Promise<void>;
}
