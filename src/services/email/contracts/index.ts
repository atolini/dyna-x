export interface EmailMessage {
  to: string | string[];
  subject: string;
  bodyText?: string;
  bodyHtml?: string;
  from?: string;
}

export interface IEmailService {
  /**
   * Sends an email.
   * @param message The message to be sent.
   */
  sendEmail(message: EmailMessage): Promise<void>;
}
