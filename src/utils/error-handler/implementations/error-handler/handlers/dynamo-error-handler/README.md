---

# DynamoErrorHandler

## Description

`DynamoErrorHandler` is an `ErrorAction` that handles specific DynamoDB-related errors, especially retryable ones. It is part of an error-handling pipeline that processes AWS DynamoDB exceptions, logs relevant details, and provides a structured response using a response builder. This handler supports various error conditions like exceeding throughput, reaching request limits, and encountering internal server errors.

It implements the `ErrorActions` interface, ensuring that it can be used in a modular error-handling setup where multiple handlers can be chained together to address different types of errors.

---

## Supported Errors

| Error Class                                | Response Type   | Log Level |
| ------------------------------------------ | --------------- | --------- |
| `ProvisionedThroughputExceededException`   | `internalError` | `error`   |
| `RequestLimitExceeded`                     | `internalError` | `error`   |
| `ConditionalCheckFailedException`          | `badRequest`    | `warn`    |
| `ItemCollectionSizeLimitExceededException` | `internalError` | `error`   |
| `InternalServerError`                      | `internalError` | `error`   |
| `LimitExceededException`                   | `internalError` | `error`   |

---

## Example Responses

Below are examples of the error responses returned for each type of error.

### ProvisionedThroughputExceededException

**Response Type:** `internalError`

**Response Example:**

```json
{
  "statusCode": 500,
  "message": "DynamoDB throughput exceeded",
  "details": "The request rate is too high for the provisioned capacity. Consider increasing RCPU/WCPU or using adaptive capacity."
}
```

---

### RequestLimitExceeded

**Response Type:** `internalError`

**Response Example:**

```json
{
  "statusCode": 500,
  "message": "DynamoDB request limit exceeded",
  "details": "Too many concurrent requests to DynamoDB."
}
```

---

### ConditionalCheckFailedException

**Response Type:** `badRequest`

**Response Example:**

```json
{
  "statusCode": 400,
  "message": "DynamoDB conditional check failed",
  "details": "The conditional update/delete operation failed because conditions were not met."
}
```

---

### ItemCollectionSizeLimitExceededException

**Response Type:** `internalError`

**Response Example:**

```json
{
  "statusCode": 500,
  "message": "DynamoDB item collection size limit exceeded",
  "details": "The item collection (table + LSI/GSI) exceeded the 10GB limit per partition key."
}
```

---

### InternalServerError

**Response Type:** `internalError`

**Response Example:**

```json
{
  "statusCode": 500,
  "message": "DynamoDB internal server error",
  "details": "A temporary server-side issue occurred."
}
```

---

### LimitExceededException

**Response Type:** `internalError`

**Response Example:**

```json
{
  "statusCode": 500,
  "message": "DynamoDB service limit exceeded",
  "details": "Exceeded AWS account/table limits (e.g., maximum tables, indexes)."
}
```
