# CognitoErrorHandler

## Description

`CognitoErrorHandler` is an implementation of the `IErrorActions` interface designed to handle errors related to Amazon Cognito operations.  
This handler detects specific exceptions such as `UserNotFoundException`, `InvalidParameterException`, `UsernameExistsException`, and `LimitExceededException` from the AWS Cognito Identity Provider SDK, logs detailed error information, and builds structured responses accordingly.

It forms part of a robust error-handling system that ensures clear communication to clients whenever Cognito-specific issues occur.

---

## Supported Errors

| Error Class                  | Response Type        | Log Level |
| ----------------------------- | -------------------- | --------- |
| `UserNotFoundException`       | `notFound`            | `error`   |
| `InvalidParameterException`   | `badRequest`          | `error`   |
| `UsernameExistsException`     | `badRequest`          | `error`   |
| `LimitExceededException`      | `tooManyRequests`     | `error`   |

---

## Example Responses

Below are examples of the error responses returned for each type of error.

### UserNotFoundException

**Response Type:** `notFound`

**Response Example:**

```json
{
  "statusCode": 404,
  "message": "User not found"
}
```

---

### InvalidParameterException

**Response Type:** `badRequest`

**Response Example:**

```json
{
  "statusCode": 400,
  "message": "Invalid parameter in the request"
}
```

---

### UsernameExistsException

**Response Type:** `badRequest`

**Response Example:**

```json
{
  "statusCode": 400,
  "message": "User already exists"
}
```

---

### LimitExceededException

**Response Type:** `tooManyRequests`

**Response Example:**

```json
{
  "statusCode": 429,
  "message": "Request limit exceeded for Cognito"
}
```