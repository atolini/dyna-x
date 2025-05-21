import { mockClient } from 'aws-sdk-client-mock';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { SESEmailService } from './ses-email-service';
import { IEmailService } from '../../contracts/i-email-service';
import { SESEmailServiceEventLogger } from './ses-email-service-event-logger';
import { Logger } from '../../../logger/implementations'; 

describe('EmailService', () => {
  const sesMock = mockClient(SESClient);
  const region = 'us-east-1';
  const defaultSender = 'noreply@example.com';
  let emailService: IEmailService;

  beforeEach(() => {
    sesMock.reset();
    emailService = new SESEmailService(defaultSender, new SESEmailServiceEventLogger(
      new Logger({
        requestId: 'req-1', 
        service: 'email-service-test',
        userId: 'user-1'
      })
    ), region);
  });

  describe('sendEmail', () => {
    const baseEmail = {
      to: 'recipient@example.com',
      subject: 'Test Email',
      bodyText: 'Plain text body',
      bodyHtml: '<p>HTML body</p>',
    };

    it('should send email successfully with default sender', async () => {
      sesMock.on(SendEmailCommand).resolves({});

      await expect(emailService.sendEmail(baseEmail)).resolves.not.toThrow();

      expect(sesMock.calls()[0].args[0].input).toMatchObject({
        Source: defaultSender,
        Destination: { ToAddresses: [baseEmail.to] },
        Message: {
          Subject: { Data: baseEmail.subject, Charset: 'UTF-8' },
          Body: {
            Text: { Data: baseEmail.bodyText, Charset: 'UTF-8' },
            Html: { Data: baseEmail.bodyHtml, Charset: 'UTF-8' },
          },
        },
      });
    });

    it('should send email using custom "from" sender if provided', async () => {
      sesMock.on(SendEmailCommand).resolves({});

      const customFrom = 'custom@example.com';
      await expect(
        emailService.sendEmail({ ...baseEmail, from: customFrom }),
      ).resolves.not.toThrow();

      expect(sesMock.calls()[0].args[0].input['Source']).toEqual(customFrom);
    });

    it('should send email to multiple recipients', async () => {
      sesMock.on(SendEmailCommand).resolves({});

      const multipleTo = ['one@example.com', 'two@example.com'];
      await expect(
        emailService.sendEmail({ ...baseEmail, to: multipleTo }),
      ).resolves.not.toThrow();

      expect(
        sesMock.calls()[0].args[0].input['Destination'].ToAddresses,
      ).toEqual(multipleTo);
    });

    it('should throw error when SES fails', async () => {
      sesMock.on(SendEmailCommand).rejects(new Error('SES error'));

      await expect(emailService.sendEmail(baseEmail)).rejects.toThrow(
        'SES error',
      );
    });
  });
});
