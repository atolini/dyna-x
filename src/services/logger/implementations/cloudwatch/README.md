# CloudWatchLogService - Logger Implementation

This package provides a concrete implementation of the [`Log Service`](../../contracts/README.md) using [AWS CloudWatch Logs](https://aws.amazon.com/cloudwatch/) to send log entries.

It fulfills the abstraction defined by the [`Log Service`](../../contracts/README.md), enabling integration with systems expecting a standardized logging service contract.

---

## ✨ Overview

- **Technology**: AWS CloudWatch Logs
- **Implements**: [`Log Service`](../../contracts/README.md)
- **Key Features**:
  - Send log entries to CloudWatch Logs.
  - Supports custom log groups and streams.
  - Automatically handles sequence token for log streams.

---

## 📁 Package Structure

```
cloudwatch-logs/
├── index.ts
├── cloudwatch-log-service.test.ts
└── README.md
```

---

## 📘 Service Details

This service is composed of a single main class that allows writing logs to AWS CloudWatch Logs.

### 1. `CloudWatchLogService<T>`

**Implements**: [`ILogService<T, LogContainer>`](../../contracts/README.md)

**Main Methods:**

- `putLog(logs: T[], logContainerId: LogContainer): Promise<void>` — Sends an array of log entries to the specified CloudWatch Logs destination, resolving log group and stream based on the provided log container ID. Automatically handles the sequence token for the log stream.

---

## 🚀 Usage Example

```typescript
import { CloudWatchLogService } from './cloudwatch-logs';
import { LogContainer } from '../../contracts';

const logService = new CloudWatchLogService<{ message: string }>();

const logContainer: LogContainer = {
  logGroupName: 'my-log-group',
  logStreamName: 'my-log-stream',
};

const logs = [{ message: 'Log entry 1' }, { message: 'Log entry 2' }];

await logService.putLog(logs, logContainer);
```

---

## 📄 Related Links

- [`Log Service Contract Interface`](../../contracts/README.md)
- [AWS CloudWatch Logs Documentation](https://aws.amazon.com/cloudwatch/)

---

## 📢 Notes

- This implementation uses the AWS SDK v3 (`@aws-sdk/client-cloudwatch-logs`).
- Ensure that the provided log group and stream exist in your AWS account, or create them before sending logs.
- Be aware of CloudWatch Logs limits, such as rate limits for log entries.
