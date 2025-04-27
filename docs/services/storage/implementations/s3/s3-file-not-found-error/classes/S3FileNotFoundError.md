[**kernel**](../../../../../../README.md)

***

[kernel](../../../../../../modules.md) / [services/storage/implementations/s3/s3-file-not-found-error](../README.md) / S3FileNotFoundError

# Class: S3FileNotFoundError

Defined in: [src/services/storage/implementations/s3/s3-file-not-found-error.ts:1](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/storage/implementations/s3/s3-file-not-found-error.ts#L1)

## Extends

- `Error`

## Constructors

### Constructor

> **new S3FileNotFoundError**(`key`): `S3FileNotFoundError`

Defined in: [src/services/storage/implementations/s3/s3-file-not-found-error.ts:4](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/storage/implementations/s3/s3-file-not-found-error.ts#L4)

#### Parameters

##### key

`string`

#### Returns

`S3FileNotFoundError`

#### Overrides

`Error.constructor`

## Properties

### cause?

> `optional` **cause**: `unknown`

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

#### Inherited from

`Error.cause`

***

### key

> `readonly` **key**: `string`

Defined in: [src/services/storage/implementations/s3/s3-file-not-found-error.ts:2](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/storage/implementations/s3/s3-file-not-found-error.ts#L2)

***

### message

> **message**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

#### Inherited from

`Error.message`

***

### name

> **name**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

#### Inherited from

`Error.name`

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

`Error.stack`

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Defined in: node\_modules/@types/node/globals.d.ts:143

Optional override for formatting stack traces

#### Parameters

##### err

`Error`

##### stackTraces

`CallSite`[]

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

`Error.prepareStackTrace`

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: node\_modules/@types/node/globals.d.ts:145

#### Inherited from

`Error.stackTraceLimit`

## Methods

### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Defined in: node\_modules/@types/node/globals.d.ts:136

Create .stack property on a target object

#### Parameters

##### targetObject

`object`

##### constructorOpt?

`Function`

#### Returns

`void`

#### Inherited from

`Error.captureStackTrace`
