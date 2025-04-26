import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { IEmailService, EmailMessage } from '../../contracts';

/**
 * AWS SES implementation of IEmailService.
 */
export class SESEmailService implements IEmailService {
  private sesClient: SESClient;
  private defaultSender: string;

  constructor(defaultSender: string, region?: string) {
    this.sesClient = new SESClient(region ? { region } : {});
    this.defaultSender = defaultSender;
  }

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
