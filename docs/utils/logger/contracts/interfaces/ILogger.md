[**kernel**](../../../../README.md)

***

[kernel](../../../../modules.md) / [utils/logger/contracts](../README.md) / ILogger

# Interface: ILogger\<T\>

Defined in: [src/utils/logger/contracts/index.ts:10](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/logger/contracts/index.ts#L10)

Generic logger interface that defines standard log methods.

Implementations should provide structured logging support for different log levels.
Each method accepts either a string message or a flat object with additional log metadata.

## Type Parameters

### T

`T`

Represents the context object type to be included in log entries,
              typically containing identifiers like service name, request ID, etc.

## Methods

### error()

> **error**(`item`): `void`

Defined in: [src/utils/logger/contracts/index.ts:23](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/logger/contracts/index.ts#L23)

Logs an error-level message or object.

#### Parameters

##### item

A string message or a flat object containing error details.

`string` | `object`

#### Returns

`void`

***

### info()

> **info**(`item`): `void`

Defined in: [src/utils/logger/contracts/index.ts:30](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/logger/contracts/index.ts#L30)

Logs an informational-level message or object.

#### Parameters

##### item

A string message or a flat object containing informational details.

`string` | `object`

#### Returns

`void`

***

### warn()

> **warn**(`item`): `void`

Defined in: [src/utils/logger/contracts/index.ts:16](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/logger/contracts/index.ts#L16)

Logs a warning-level message or object.

#### Parameters

##### item

A string message or a flat object containing warning details.

`string` | `object`

#### Returns

`void`
