# SESEmailErrorHandler

## Description

`SESEmailErrorHandler` is an implementation of the `IErrorActions` interface specialized in handling AWS SES (Simple Email Service) related errors.  
This handler captures specific exceptions such as `MessageRejected`, `MailFromDomainNotVerifiedException`, and `ConfigurationSetDoesNotExistException`, returning structured responses and logging detailed error information.

It ensures proper error management when sending emails using SES and helps provide clearer feedback when issues arise.

---

## Supported Errors

| Error Class                             | Response Type   | Log Level |
| --------------------------------------- | --------------- | --------- |
| `MessageRejected`                       | `badRequest`    | `error`   |
| `MailFromDomainNotVerifiedException`    | `badRequest`    | `error`   |
| `ConfigurationSetDoesNotExistException` | `internalError` | `error`   |

---

## Example Responses

Below are examples of the error responses returned for each type of error.

### MessageRejected

**Response Type:** `badRequest`

**Response Example:**

```json
{
  "statusCode": 400,
  "message": "Email message was rejected by SES"
}
```

---

### MailFromDomainNotVerifiedException

**Response Type:** `badRequest`

**Response Example:**

```json
{
  "statusCode": 400,
  "message": "Sender domain is not verified in SES"
}
```

---

### ConfigurationSetDoesNotExistException

**Response Type:** `internalError`

**Response Example:**

```json
{
  "statusCode": 500,
  "message": "SES configuration set does not exist"
}
```
