---

# S3ErrorHandler

## Description

`S3ErrorHandler` is an implementation of the `ErrorActions` interface designed to handle errors related to S3 operations, specifically issues like file not found and bucket errors. This handler logs detailed error information and returns a structured response based on the error type.

It is part of an error-handling mechanism that processes S3-specific exceptions such as `S3FileNotFoundError` and `NoSuchBucket` from the AWS SDK. The handler ensures that appropriate responses are returned for these errors, helping to maintain clear communication with clients.

---

## Supported Errors

| Error Class           | Response Type   | Log Level |
| --------------------- | --------------- | --------- |
| `S3FileNotFoundError` | `notFound`      | `error`   |
| `NoSuchBucket`        | `internalError` | `error`   |

---

## Example Responses

Below are examples of the error responses returned for each type of error.

### S3FileNotFoundError

**Response Type:** `notFound`

**Response Example:**

```json
{
  "statusCode": 404,
  "message": "File not found in S3",
  "details": "The object with key \"my-file-key\" was not found in the S3 bucket."
}
```

---

### NoSuchBucket

**Response Type:** `internalError`

**Response Example:**

```json
{
  "statusCode": 500,
  "message": "S3 bucket does not exist",
  "details": "The specified S3 bucket may be missing, deleted, or the name is incorrect."
}
```

---
