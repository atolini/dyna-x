---

# 📦 ResponseBuilder

A lightweight utility class for building consistent API responses in **AWS Lambda** environments.  
Implements a flexible interface, allowing you to easily swap or extend the response format according to your project needs.

---

## 📚 Table of Contents

- [Installation](#installation)
- [Interface-Based Design](#interface-based-design)
- [Import and Usage](#import-and-usage)
- [Quick Example](#quick-example)
- [Methods](#methods)
  - [ok()](#ok)
  - [created()](#created)
  - [badRequest()](#badrequest)
  - [notFound()](#notfound)
  - [internalError()](#internalerror)
  - [custom()](#custom)
- [Extending Response Format](#extending-response-format)
- [Type Definitions](#type-definitions)

---

## 📥 Installation

```bash
npm install response-builder
# or
yarn add response-builder
```

---

## 💡 Interface-Based Design

At the core of this service is the `IResponseBuilder<R>` interface, which standardizes how responses are built.  
By default, the implementation returns AWS-compatible `APIGatewayProxyResult`, but you can create **custom response builders** to return other shapes or formats.

### Interface: `IResponseBuilder<R = APIGatewayProxyResult>`

```ts
export interface IResponseBuilder<R = APIGatewayProxyResult> {
  ok<T>(data: T): R;
  created<T>(data: T): R;
  notFound(message: string): R;
  badRequest(message: string, details?: unknown): R;
  internalError(message?: string, details?: unknown): R;
  custom<T>(statusCode: number, success: boolean, payload: T): R;
}
```

Use this interface to implement alternative response strategies while maintaining method consistency.

---

## 🚀 Import and Usage

```ts
import { ResponseBuilder } from 'response-builder';

const response = new ResponseBuilder();
```

---

## ⚡ Quick Example

```ts
const response = new ResponseBuilder();

export const handler = async (): Promise<APIGatewayProxyResult> => {
  const data = { message: 'Hello World' };
  return response.ok(data);
};
```

---

## 🧩 Methods

### ✅ `ok<T>(data: T): APIGatewayProxyResult`

Returns a 200 (OK) response with your data.

```ts
response.ok({ id: 1, name: 'Item' });
```

Response:

```json
{
  "statusCode": 200,
  "body": "{\"success\":true,\"data\":{\"id\":1,\"name\":\"Item\"}}"
}
```

---

### 🆕 `created<T>(data: T): APIGatewayProxyResult`

Returns a 201 (Created) response.

```ts
response.created({ id: 123 });
```

---

### ⚠️ `badRequest(message: string, details?: unknown): APIGatewayProxyResult`

Returns a 400 (Bad Request) with an optional details object.

```ts
response.badRequest('Invalid input', { field: 'email' });
```

---

### ❌ `notFound(message: string): APIGatewayProxyResult`

Returns a 404 (Not Found) with a message.

```ts
response.notFound('User not found');
```

---

### 🛠 `internalError(message?: string, details?: unknown): APIGatewayProxyResult`

Returns a 500 (Internal Server Error). You can customize the message and attach extra debug details.

```ts
response.internalError();
response.internalError('Database crash', { retryable: false });
```

---

### ⚙️ `custom<T>(statusCode: number, success: boolean, payload: T): APIGatewayProxyResult`

Returns a fully customizable response.

```ts
response.custom(202, true, { info: 'Processing started' });
```

Output:

```json
{
  "statusCode": 202,
  "body": "{\"success\":true,\"info\":\"Processing started\"}"
}
```

---

## 🔧 Extending Response Format

Want to return a completely different structure (e.g., without `success`, or as an HTML response)? Just implement your own builder using the same interface:

```ts
import { IResponseBuilder } from 'response-builder';

class CustomResponseBuilder implements IResponseBuilder<string> {
  ok<T>(data: T): string {
    return `OK: ${JSON.stringify(data)}`;
  }

  // Implement other methods...
}
```

You can then inject this custom builder wherever needed, enabling flexibility and testability in your application.

---

## 🧾 Type Definitions

### `APIGatewayProxyResult`

This is the default return type from AWS Lambda handlers integrated with API Gateway.

```ts
interface APIGatewayProxyResult {
  statusCode: number;
  headers?: {
    [header: string]: string;
  };
  body: string;
}
```