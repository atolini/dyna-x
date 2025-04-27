# CloudWatchLogErrorHandler

## Description

`CloudWatchLogErrorHandler` is an implementation of the `IErrorActions` interface dedicated to handling AWS CloudWatch Logs related errors.  
This handler processes specific exceptions such as `ResourceNotFoundException`, `InvalidSequenceTokenException`, and `DataAlreadyAcceptedException` from the AWS CloudWatch Logs SDK, ensuring appropriate responses are returned and detailed logs are generated.

It helps maintain reliable communication with clients when CloudWatch Logs operations encounter known issues or unexpected conditions.

---

## Supported Errors

| Error Class                     | Response Type   | Log Level |
| -------------------------------- | --------------- | --------- |
| `ResourceNotFoundException`      | `notFound`      | `error`   |
| `InvalidSequenceTokenException`  | `badRequest`    | `error`   |
| `DataAlreadyAcceptedException`   | `badRequest`    | `error`   |

---

## Example Responses

Below are examples of the error responses returned for each type of error.

### ResourceNotFoundException

**Response Type:** `notFound`

**Response Example:**

```json
{
  "statusCode": 404,
  "message": "Log group or log stream not found"
}
```

---

### InvalidSequenceTokenException

**Response Type:** `badRequest`

**Response Example:**

```json
{
  "statusCode": 400,
  "message": "Invalid sequence token for log stream"
}
```

---

### DataAlreadyAcceptedException

**Response Type:** `badRequest`

**Response Example:**

```json
{
  "statusCode": 400,
  "message": "Log event data was already accepted"
}
```