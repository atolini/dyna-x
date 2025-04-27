[**kernel**](../../../../../README.md)

***

[kernel](../../../../../modules.md) / [utils/logger/implementations/logger](../README.md) / Logger

# Class: Logger\<T\>

Defined in: [src/utils/logger/implementations/logger/index.ts:12](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/logger/implementations/logger/index.ts#L12)

A simple, structured logger implementation that outputs JSON logs to the console.

Designed to work seamlessly with AWS CloudWatch Logs and metric filters.
Automatically includes a flat base context for all log entries and supports
logging either strings or flat objects.

## Type Parameters

### T

`T` *extends* `Record`\<`string`, `string`\>

The shape of the base context that will be included in all log messages.

## Implements

- [`ILogger`](../../../contracts/interfaces/ILogger.md)\<`T`\>

## Constructors

### Constructor

> **new Logger**\<`T`\>(`contextItem`): `Logger`\<`T`\>

Defined in: [src/utils/logger/implementations/logger/index.ts:21](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/logger/implementations/logger/index.ts#L21)

Creates a new instance of the Logger with a fixed context.
The context is merged into every log entry as top-level keys.

#### Parameters

##### contextItem

`T`

A flat object containing static context information (e.g., service name, request ID).

#### Returns

`Logger`\<`T`\>

## Methods

### error()

> **error**(`item`): `void`

Defined in: [src/utils/logger/implementations/logger/index.ts:39](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/logger/implementations/logger/index.ts#L39)

Logs an error-level message.

#### Parameters

##### item

A string message or a flat object containing error data.

`string` | `object`

#### Returns

`void`

#### Implementation of

[`ILogger`](../../../contracts/interfaces/ILogger.md).[`error`](../../../contracts/interfaces/ILogger.md#error)

***

### info()

> **info**(`item`): `void`

Defined in: [src/utils/logger/implementations/logger/index.ts:48](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/logger/implementations/logger/index.ts#L48)

Logs an informational-level message.

#### Parameters

##### item

A string message or a flat object containing informational data.

`string` | `object`

#### Returns

`void`

#### Implementation of

[`ILogger`](../../../contracts/interfaces/ILogger.md).[`info`](../../../contracts/interfaces/ILogger.md#info)

***

### warn()

> **warn**(`item`): `void`

Defined in: [src/utils/logger/implementations/logger/index.ts:30](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/logger/implementations/logger/index.ts#L30)

Logs a warning-level message.

#### Parameters

##### item

A string message or a flat object containing warning data.

`string` | `object`

#### Returns

`void`

#### Implementation of

[`ILogger`](../../../contracts/interfaces/ILogger.md).[`warn`](../../../contracts/interfaces/ILogger.md#warn)
