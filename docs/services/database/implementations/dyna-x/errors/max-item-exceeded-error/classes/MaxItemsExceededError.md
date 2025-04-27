[**kernel**](../../../../../../../README.md)

***

[kernel](../../../../../../../modules.md) / [services/database/implementations/dyna-x/errors/max-item-exceeded-error](../README.md) / MaxItemsExceededError

# Class: MaxItemsExceededError

Defined in: [src/services/database/implementations/dyna-x/errors/max-item-exceeded-error.ts:21](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/implementations/dyna-x/errors/max-item-exceeded-error.ts#L21)

Custom error class indicating that a DynamoDB batch operation exceeded the maximum allowed items.

 MaxItemsExceededError

## Examples

```ts
// Throwing the error
throw new MaxItemsExceededError(25);
```

```ts
// Catching the error
try {
  // batch operation that might exceed limits
} catch (error) {
  if (error instanceof MaxItemsExceededError) {
    console.error(`Batch limit exceeded: ${error.message}`);
  }
}
```

## Extends

- `Error`

## Constructors

### Constructor

> **new MaxItemsExceededError**(`limit`): `MaxItemsExceededError`

Defined in: [src/services/database/implementations/dyna-x/errors/max-item-exceeded-error.ts:26](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/implementations/dyna-x/errors/max-item-exceeded-error.ts#L26)

Creates a new MaxItemsExceededError instance.

#### Parameters

##### limit

`number`

The maximum number of items allowed in the operation

#### Returns

`MaxItemsExceededError`

#### Overrides

`Error.constructor`

## Properties

### cause?

> `optional` **cause**: `unknown`

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

#### Inherited from

`Error.cause`

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
