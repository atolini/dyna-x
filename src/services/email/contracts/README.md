# Abstraction Layer for Email Service Operations

This package defines a simple and flexible abstraction for sending email messages.  
It allows for easy integration with different email service providers while maintaining a consistent contract across implementations.

## ✨ Overview

- `EmailMessage` — DTO representing the structure of an email message.
- `IEmailService` — Interface defining the contract for sending emails.

These interfaces ensure that different email service implementations behave consistently, regardless of the underlying provider (e.g., SES, SendGrid, SMTP).

---

## 📁 Package Structure

```
messaging/
└── contracts/
    └── index.ts
```

---

## 📘 Interface Details

### 1. `EmailMessage`

**Main Fields:**

- `to: string | string[]` — The recipient or list of recipients for the email.
- `subject: string` — The subject line of the email.
- `bodyText?: string` — (Optional) The plain text body of the email.
- `bodyHtml?: string` — (Optional) The HTML-formatted body of the email.
- `from?: string` — (Optional) The sender's email address.

---

### 2. `IEmailService`

**Main Methods:**

- `sendEmail(message: EmailMessage): Promise<void>` — Sends an email based on the provided message structure.

---

## 🚀 Use Case

This abstraction layer can be used to integrate multiple email service providers seamlessly into a system without changing the application logic.

For example:

- Implement an `SESEmailService` that fulfills the `IEmailService` interface using AWS Simple Email Service (SES).
- Implement a `SendGridEmailService` that uses the SendGrid API.
- Create mock email services for unit testing without sending real emails.

By adhering to this interface, systems can swap email providers easily and maintain a clean, decoupled architecture.
