---
# 📦 Logger

A lightweight and structured logger designed for **Node.js** environments, ideal for AWS Lambda and CloudWatch usage.
Follows a flexible interface-first design, making it easy to **swap** or **extend** the logging implementation across different environments or log providers.
---

## 📚 Table of Contents

- [Overview](#overview)
- [Interface: ILogger](#interface-ilogger)
- [Class: Logger](#class-logger)
- [Usage Example](#usage-example)
- [Extending or Replacing](#extending-or-replacing)
- [Type Parameters](#type-parameters)

---

## 🔍 Overview

This logger is designed to:

- Print structured JSON logs to `stdout`.
- Include **consistent contextual metadata** (e.g., request ID, service name).
- Support all common log levels: `info`, `warn`, and `error`.
- Be **interface-driven**, allowing easy replacement with a more advanced logger (e.g., Winston, Pino).

---

## 🧩 Interface: `ILogger<T>`

Defines a generic logger contract to ensure consistency and testability across implementations.

```ts
/**
 * Generic logger interface that defines standard log methods.
 *
 * Implementations should provide structured logging support for different log levels.
 *
 * @template T - Represents the context object type included in log entries.
 */
export interface ILogger<T> {
  warn(item: object | string): void;
  error(item: object | string): void;
  info(item: object | string): void;
}
```

✅ You can easily inject `ILogger` instead of depending directly on the `Logger` class — making your code more decoupled and testable.

---

## 🏗 Class: `Logger<T>`

### Constructor

```ts
new Logger<T>(contextItem: T)
```

Creates a logger instance with a static base context that will be merged into every log line.

| Param         | Type                    | Description                                                                      |
| ------------- | ----------------------- | -------------------------------------------------------------------------------- |
| `contextItem` | `Record<string,string>` | Flat key-value object with static context info (e.g. `requestId`, `serviceName`) |

### Methods

| Method  | Description                              |
| ------- | ---------------------------------------- |
| `info`  | Logs an `info`-level message or object.  |
| `warn`  | Logs a `warn`-level message or object.   |
| `error` | Logs an `error`-level message or object. |

All messages are serialized to JSON and automatically include:

- `level` (`info` | `warn` | `error`)
- `timestamp` in ISO 8601 format
- All fields from the base context
- A message (string) or additional fields (object)

---

## 💡 Usage Example

```ts
import { Logger } from './logger';

const logger = new Logger({ service: 'UserService', requestId: 'abc-123' });

logger.info('User created');
logger.warn({ warning: 'Email not verified', userId: 'u-321' });
logger.error({ error: 'Database timeout', retryable: false });
```

Sample output:

```json
{
  "level": "info",
  "timestamp": "2025-04-13T14:12:00.123Z",
  "service": "UserService",
  "requestId": "abc-123",
  "message": "User created"
}
```

---

## 🔧 Extending or Replacing

You can easily create a custom logger implementation by implementing the `ILogger<T>` interface.  
For example, logging to a remote service, file, or even buffering logs:

```ts
class RemoteLogger<T> implements ILogger<T> {
  constructor(private context: T) {}

  info(item: object | string): void {
    // Send logs to remote API
  }

  warn(item: object | string): void {
    // ...
  }

  error(item: object | string): void {
    // ...
  }
}
```

---

## 🧾 Type Parameters

### `T`

Used to define the **shape of your context object**, which will be automatically merged into every log line.

Example:

```ts
type LogContext = {
  service: string;
  requestId: string;
};

const logger = new Logger<LogContext>({
  service: 'OrderService',
  requestId: 'req-0001',
});
```
