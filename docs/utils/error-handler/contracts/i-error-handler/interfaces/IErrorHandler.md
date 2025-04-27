[**kernel**](../../../../../README.md)

***

[kernel](../../../../../modules.md) / [utils/error-handler/contracts/i-error-handler](../README.md) / IErrorHandler

# Interface: IErrorHandler\<T, R\>

Defined in: [src/utils/error-handler/contracts/i-error-handler.ts:10](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/error-handler/contracts/i-error-handler.ts#L10)

Interface for an ErrorHandler that processes errors using specific handlers.

## Type Parameters

### T

`T`

The type of the response returned by the handler (e.g., API response type).

### R

`R` *extends* [`IResponseBuilder`](../../../../response-builder/contracts/interfaces/IResponseBuilder.md)\<`T`\>

The response builder type that implements the `IResponseBuilder<T>` interface.

## Methods

### handleError()

> **handleError**(`error`): `T`

Defined in: [src/utils/error-handler/contracts/i-error-handler.ts:18](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/error-handler/contracts/i-error-handler.ts#L18)

Handles an error by delegating it to the appropriate handler.
If no handler is found, logs the error and returns a generic internal error response.

#### Parameters

##### error

`Error`

The error to handle.

#### Returns

`T`

The generated response.
