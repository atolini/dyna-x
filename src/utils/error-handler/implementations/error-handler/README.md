---
# ❗ ErrorHandler — Generic Error Processing System

A flexible, extensible system for handling errors with custom logic per error type.
Promotes clean separation of concerns using the **Chain of Responsibility** pattern.
---

## 📦 Components Overview

### 1. `ErrorActions<T, R>`

Defines the **contract** for error-handling actions.

### 2. `ErrorHandler<T, R>`

Central class that delegates errors to the first handler capable of processing them.

### 3. Custom Handlers (e.g. `DynamoErrorHandler`)

Plug-and-play error resolvers implementing `ErrorActions`.

---

## 🧩 Interface: `ErrorActions<T, R>`

```ts
export interface ErrorActions<T, R extends IResponseBuilder<T>> {
  handle(error: Error, logger: ILogger<any>, resBuilder: R): T;
  canHandle(error: Error): boolean;
}
```

| Method      | Description                                                          |
| ----------- | -------------------------------------------------------------------- |
| `handle`    | Processes the error and returns a built response using `resBuilder`. |
| `canHandle` | Returns `true` if the handler can process the given error.           |

> 🔁 **Extensible**: Create multiple handlers, each focused on specific error types.

---

## ⚙️ Class: `ErrorHandler<T, R>`

```ts
export class ErrorHandler<T, R extends IResponseBuilder<T>> { ... }
```

### Constructor

```ts
new ErrorHandler(resBuilder: R, logger: ILogger<any>, handlers?: ErrorActions<T, R>[])
```

| Param        | Type                          | Description                                                       |
| ------------ | ----------------------------- | ----------------------------------------------------------------- |
| `resBuilder` | `R`                           | A response builder implementing `IResponseBuilder<T>`.            |
| `logger`     | `ILogger<any>`                | Logger instance for capturing details of unexpected errors.       |
| `handlers`   | `ErrorActions<T, R>[]` (opt.) | Optional list of custom error handlers. Uses defaults if omitted. |

### Method: `handleError`

```ts
handleError(error: Error): T
```

Attempts to find the first handler that returns `true` for `canHandle()`, and delegates the error to its `handle()` method.  
If no handler matches, logs the error and returns a generic internal server error.

---

## 🛠️ Usage Example

```ts
const handler = new ErrorHandler<MyApiResponseType, MyResponseBuilder>(
  new MyResponseBuilder(),
  new MyLogger(),
);

try {
  throw new SomeCustomError('Oops');
} catch (error) {
  const response = handler.handleError(error);
  return response;
}
```

---

## ✨ Creating a Custom Error Handler

Just implement the `ErrorActions` interface:

```ts
class ValidationErrorHandler<T, R extends IResponseBuilder<T>>
  implements ErrorActions<T, R>
{
  canHandle(error: Error): boolean {
    return error.name === 'ValidationError';
  }

  handle(error: Error, logger: ILogger<any>, resBuilder: R): T {
    logger.warn({ message: error.message });
    return resBuilder.badRequest(error.message);
  }
}
```

Then plug it into the `ErrorHandler`:

```ts
new ErrorHandler(resBuilder, logger, [
  new ValidationErrorHandler(),
  new DynamoErrorHandler(),
]);
```

---

## 💡 Why Use This Pattern?

- ✅ **Scalable** — add handlers without modifying core logic.
- ✅ **Testable** — test handlers in isolation.
- ✅ **Flexible** — different responses per error type.
- ✅ **Inversion of Control** — decouples error types from error presentation logic.

---
