[**kernel**](../../../../../README.md)

***

[kernel](../../../../../modules.md) / [services/logger/implementations/cloudwatch](../README.md) / CloudWatchLogService

# Class: CloudWatchLogService\<T\>

Defined in: [src/services/logger/implementations/cloudwatch/index.ts:19](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/logger/implementations/cloudwatch/index.ts#L19)

Service responsible for writing log entries to AWS CloudWatch Logs.

## Template

The type representing the log container ID (used to resolve group and stream).

## Type Parameters

### T

`T`

The type of individual log entries.

## Implements

- [`ILogService`](../../../contracts/interfaces/ILogService.md)\<`T`, [`LogContainer`](../interfaces/LogContainer.md)\>

## Constructors

### Constructor

> **new CloudWatchLogService**\<`T`\>(`region`): `CloudWatchLogService`\<`T`\>

Defined in: [src/services/logger/implementations/cloudwatch/index.ts:27](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/logger/implementations/cloudwatch/index.ts#L27)

Constructs a new instance of CloudWatchLogService.

#### Parameters

##### region

`string` = `'us-east-1'`

AWS region for the CloudWatchLogs client (default: 'us-east-1').

#### Returns

`CloudWatchLogService`\<`T`\>

## Methods

### putLog()

> **putLog**(`logs`, `logContainerId`): `Promise`\<`void`\>

Defined in: [src/services/logger/implementations/cloudwatch/index.ts:37](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/logger/implementations/cloudwatch/index.ts#L37)

Sends an array of logs to the specified CloudWatch Logs destination.

#### Parameters

##### logs

`T`[]

Array of log entries to be sent.

##### logContainerId

[`LogContainer`](../interfaces/LogContainer.md)

Identifier used to determine the log group and log stream names.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ILogService`](../../../contracts/interfaces/ILogService.md).[`putLog`](../../../contracts/interfaces/ILogService.md#putlog)
