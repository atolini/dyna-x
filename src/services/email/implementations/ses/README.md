# SESEmailService - Email Implementation

This package provides a concrete implementation of the [`Email Service`](../../contracts/README.md) using [Amazon SES (Simple Email Service)](https://aws.amazon.com/ses/) for sending emails.

It fulfills the abstraction defined by the [`Email Service`](../../contracts/README.md), enabling integration with systems expecting a standardized service contract for email operations.

---

## ✨ Overview

- **Technology**: Amazon SES (Simple Email Service)
- **Implements**: [`Email Service`](../../contracts/README.md)
- **Key Features**:
  - Send plain text and HTML emails.
  - Support for individual email sending.
  - Flexible sender configuration (custom sender or default sender).

---

## 📁 Package Structure

```
ses-email/
├── index.ts
├── ses-email-service.test.ts
└── README.md
```

---

## 📘 Service Details

This service is composed of a single main class that provides email sending functionality using Amazon SES.

### 1. `SESEmailService`

**Implements**: [`IEmailService`](../../contracts/README.md)

**Main Methods:**

- `sendEmail(message: EmailMessage): Promise<void>` — Sends an email using Amazon SES. Supports both plain text and HTML content, as well as custom or default sender email addresses.

---

## 🚀 Usage Example

```typescript
import { SESEmailService } from './ses-email';
import { EmailMessage } from '../../contracts';

const emailService = new SESEmailService('your-default-sender@example.com');

// Sending an email
const emailMessage: EmailMessage = {
  to: 'recipient@example.com',
  subject: 'Test Email',
  bodyText: 'This is a test email sent using SES.',
  bodyHtml: '<p>This is a test email sent using <strong>SES</strong>.</p>',
};

await emailService.sendEmail(emailMessage);
```

---

## 📄 Related Links

- [`Email Service Contract Interface`](../../contracts/README.md)
- [Amazon SES Documentation](https://aws.amazon.com/ses/)

---

## 📢 Notes

- This implementation uses the AWS SDK v3 (`@aws-sdk/client-ses`).
- Ensure that the sender email is verified in your AWS SES account to avoid errors during sending.
- Be mindful of SES sending limits in your AWS account to prevent throttling.
- Future enhancements may include support for email attachments and advanced email features.
