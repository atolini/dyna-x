[**kernel**](../../../../README.md)

***

[kernel](../../../../modules.md) / [services/logger/contracts](../README.md) / ILogService

# Interface: ILogService\<T, Q\>

Defined in: [src/services/logger/contracts/index.ts:8](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/logger/contracts/index.ts#L8)

Interface for a logging service that supports writing log entries
to a given log container (such as a log group or file).

## Type Parameters

### T

`T`

The type representing individual log entries.

### Q

`Q`

The type representing the log container identifier (e.g., a log group or stream key).

## Methods

### putLog()

> **putLog**(`logs`, `logContainerId`): `Promise`\<`void`\>

Defined in: [src/services/logger/contracts/index.ts:16](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/logger/contracts/index.ts#L16)

Writes an array of log entries to a specified log container.

#### Parameters

##### logs

`T`[]

An array of log entries to be written.

##### logContainerId

`Q`

Identifier used to resolve the target log container.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the log entries have been written.
