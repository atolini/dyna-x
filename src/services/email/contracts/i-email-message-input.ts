/**
 * Represents an email message to be sent.
 *
 * This interface defines the structure of an email message, including the recipient(s), subject,
 * and optional body content in both text and HTML formats.
 *
 */
export interface IEmailMessageInput {
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
