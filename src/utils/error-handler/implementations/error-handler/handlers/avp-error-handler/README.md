# AVPAuthorizationErrorHandler

## Description

`AVPAuthorizationErrorHandler` is an implementation of the `IErrorActions` interface designed to handle authorization errors related to Amazon Verified Permissions (AVP) operations.  
This handler detects specific exceptions such as `ResourceNotFoundException` and `AccessDeniedException` from the AWS Verified Permissions SDK, logs detailed error information, and builds structured responses according to the type of error.

It is part of a broader error-handling mechanism to ensure clear and consistent communication with clients when authorization issues occur during policy store operations.

---

## Supported Errors

| Error Class                 | Response Type | Log Level |
| --------------------------- | ------------- | --------- |
| `ResourceNotFoundException` | `notFound`    | `error`   |
| `AccessDeniedException`     | `forbidden`   | `error`   |

---

## Example Responses

Below are examples of the error responses returned for each type of error.

### ResourceNotFoundException

**Response Type:** `notFound`

**Response Example:**

```json
{
  "statusCode": 404,
  "message": "The resource was not found"
}
```

---

### AccessDeniedException

**Response Type:** `forbidden`

**Response Example:**

```json
{
  "statusCode": 403,
  "message": "Access denied for the requested action"
}
```
