[**kernel**](../../../../README.md)

***

[kernel](../../../../modules.md) / [utils/response-builder/contracts](../README.md) / IResponseBuilder

# Interface: IResponseBuilder\<R\>

Defined in: [src/utils/response-builder/contracts/index.ts:7](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/response-builder/contracts/index.ts#L7)

Interface to standardize API responses.
Allows defining a return type `R` for all responses.

## Type Parameters

### R

`R`

The expected return type for the methods.

## Methods

### badRequest()

> **badRequest**(`message`, `details?`): `R`

Defined in: [src/utils/response-builder/contracts/index.ts:41](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/response-builder/contracts/index.ts#L41)

Returns an error response with status 400 (Bad Request).

#### Parameters

##### message

`string`

The error message to be returned.

##### details?

`unknown`

(Optional) Additional details about the error.

#### Returns

`R`

A formatted response of type `R`.

***

### created()

> **created**\<`T`\>(`data`): `R`

Defined in: [src/utils/response-builder/contracts/index.ts:24](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/response-builder/contracts/index.ts#L24)

Returns a success response with status 201 (Created).

#### Type Parameters

##### T

`T`

The type of the data returned in the response.

#### Parameters

##### data

`T`

The data to be included in the response.

#### Returns

`R`

A formatted response of type `R`.

***

### custom()

> **custom**\<`T`\>(`statusCode`, `success`, `payload`): `R`

Defined in: [src/utils/response-builder/contracts/index.ts:70](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/response-builder/contracts/index.ts#L70)

Returns a custom response with a user-defined status and structure.

#### Type Parameters

##### T

`T`

The type of the data returned in the response.

#### Parameters

##### statusCode

`number`

The HTTP status code to be returned.

##### success

`boolean`

Indicates whether the response represents success (`true`) or failure (`false`).

##### payload

`T`

The data to be included in the response.

#### Returns

`R`

A formatted response of type `R`.

***

### forbidden()

> **forbidden**(`message`, `details?`): `R`

Defined in: [src/utils/response-builder/contracts/index.ts:79](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/response-builder/contracts/index.ts#L79)

Returns an error response with status 403 (Forbidden).

#### Parameters

##### message

`string`

The error message to be returned.

##### details?

`unknown`

(Optional) Additional details about the error.

#### Returns

`R`

A formatted response of type `R`.

***

### internalError()

> **internalError**(`message?`, `details?`): `R`

Defined in: [src/utils/response-builder/contracts/index.ts:50](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/response-builder/contracts/index.ts#L50)

Returns an internal server error response with status 500 (Internal Server Error).

#### Parameters

##### message?

`string`

(Optional) Custom error message. Default: `'Internal Server Error'`.

##### details?

`unknown`

(Optional) Additional details about the error.

#### Returns

`R`

A formatted response of type `R`.

***

### notFound()

> **notFound**(`message`): `R`

Defined in: [src/utils/response-builder/contracts/index.ts:32](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/response-builder/contracts/index.ts#L32)

Returns an error response with status 404 (Not Found).

#### Parameters

##### message

`string`

The message explaining what was not found.

#### Returns

`R`

A formatted response of type `R`.

***

### ok()

> **ok**\<`T`\>(`data`): `R`

Defined in: [src/utils/response-builder/contracts/index.ts:15](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/response-builder/contracts/index.ts#L15)

Returns a success response with status 200 (OK).

#### Type Parameters

##### T

`T`

The type of the data returned in the response.

#### Parameters

##### data

`T`

The data to be included in the response.

#### Returns

`R`

A formatted response of type `R`.

***

### tooManyRequests()

> **tooManyRequests**(`message?`, `details?`): `R`

Defined in: [src/utils/response-builder/contracts/index.ts:59](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/response-builder/contracts/index.ts#L59)

Returns an error response with status 429 (Too Many Requests).

#### Parameters

##### message?

`string`

(Optional) Custom error message. Default: `'Too Many Requests'`.

##### details?

`unknown`

(Optional) Additional details about the error, such as retry-after time.

#### Returns

`R`

A formatted response of type `R`.
