# Abstraction Layer for Logging Service Operations

This package defines an abstraction for logging operations, enabling the writing of log entries to various log containers while keeping implementations consistent and flexible.

## ✨ Overview

- `ILogService<T, Q>` — Interface defining the contract for writing log entries to a specified log container.

This interface ensures that different logging implementations behave uniformly, whether writing to cloud log groups, local files, or external logging services.

---

## 📁 Package Structure

```
logging/
└── contracts/
    └── index.ts
```

---

## 📘 Interface Details

### 1. `ILogService<T, Q>`

**Type Parameters:**

- `T` — Represents the structure of individual log entries.
- `Q` — Represents the identifier for the log container (e.g., log group name, file path, stream key).

**Main Methods:**

- `putLog(logs: T[], logContainerId: Q): Promise<void>` — Writes an array of log entries into the specified log container.

---

## 🚀 Use Case

This abstraction layer allows systems to integrate various logging strategies without changing the business logic.

For example:

- Implement a `CloudWatchLogService` that fulfills the `ILogService` interface by writing logs to AWS CloudWatch.
- Implement a `FileLogService` that writes logs to a local or remote file system.
- Create a mock logging service for testing purposes without actually persisting logs.

By following this interface, applications can switch logging providers easily and maintain clean, modular, and scalable code.
