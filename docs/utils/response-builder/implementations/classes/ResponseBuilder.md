[**kernel**](../../../../README.md)

***

[kernel](../../../../modules.md) / [utils/response-builder/implementations](../README.md) / ResponseBuilder

# Class: ResponseBuilder

Defined in: [src/utils/response-builder/implementations/index.ts:4](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/response-builder/implementations/index.ts#L4)

Interface to standardize API responses.
Allows defining a return type `R` for all responses.

## Implements

- [`IResponseBuilder`](../../contracts/interfaces/IResponseBuilder.md)\<`APIGatewayProxyResult`\>

## Constructors

### Constructor

> **new ResponseBuilder**(): `ResponseBuilder`

#### Returns

`ResponseBuilder`

## Methods

### badRequest()

> **badRequest**(`message`, `details?`): `APIGatewayProxyResult`

Defined in: [src/utils/response-builder/implementations/index.ts:42](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/response-builder/implementations/index.ts#L42)

Returns an error response with status 400 (Bad Request).

#### Parameters

##### message

`string`

The error message to be returned.

##### details?

`unknown`

(Optional) Additional details about the error.

#### Returns

`APIGatewayProxyResult`

A formatted response of type `R`.

#### Implementation of

[`IResponseBuilder`](../../contracts/interfaces/IResponseBuilder.md).[`badRequest`](../../contracts/interfaces/IResponseBuilder.md#badrequest)

***

### created()

> **created**\<`T`\>(`data`): `APIGatewayProxyResult`

Defined in: [src/utils/response-builder/implementations/index.ts:34](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/response-builder/implementations/index.ts#L34)

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

`APIGatewayProxyResult`

A formatted response of type `R`.

#### Implementation of

[`IResponseBuilder`](../../contracts/interfaces/IResponseBuilder.md).[`created`](../../contracts/interfaces/IResponseBuilder.md#created)

***

### custom()

> **custom**\<`T`\>(`statusCode`, `success`, `payload`): `APIGatewayProxyResult`

Defined in: [src/utils/response-builder/implementations/index.ts:69](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/response-builder/implementations/index.ts#L69)

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

`APIGatewayProxyResult`

A formatted response of type `R`.

#### Implementation of

[`IResponseBuilder`](../../contracts/interfaces/IResponseBuilder.md).[`custom`](../../contracts/interfaces/IResponseBuilder.md#custom)

***

### forbidden()

> **forbidden**(`message`, `details?`): `APIGatewayProxyResult`

Defined in: [src/utils/response-builder/implementations/index.ts:7](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/response-builder/implementations/index.ts#L7)

Returns an error response with status 403 (Forbidden).

#### Parameters

##### message

`string` = `'Forbidden'`

The error message to be returned.

##### details?

`unknown`

(Optional) Additional details about the error.

#### Returns

`APIGatewayProxyResult`

A formatted response of type `R`.

#### Implementation of

[`IResponseBuilder`](../../contracts/interfaces/IResponseBuilder.md).[`forbidden`](../../contracts/interfaces/IResponseBuilder.md#forbidden)

***

### internalError()

> **internalError**(`message`, `details?`): `APIGatewayProxyResult`

Defined in: [src/utils/response-builder/implementations/index.ts:58](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/response-builder/implementations/index.ts#L58)

Returns an internal server error response with status 500 (Internal Server Error).

#### Parameters

##### message

`string` = `'Internal Server Error'`

(Optional) Custom error message. Default: `'Internal Server Error'`.

##### details?

`unknown`

(Optional) Additional details about the error.

#### Returns

`APIGatewayProxyResult`

A formatted response of type `R`.

#### Implementation of

[`IResponseBuilder`](../../contracts/interfaces/IResponseBuilder.md).[`internalError`](../../contracts/interfaces/IResponseBuilder.md#internalerror)

***

### notFound()

> **notFound**(`message`): `APIGatewayProxyResult`

Defined in: [src/utils/response-builder/implementations/index.ts:50](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/response-builder/implementations/index.ts#L50)

Returns an error response with status 404 (Not Found).

#### Parameters

##### message

`string`

The message explaining what was not found.

#### Returns

`APIGatewayProxyResult`

A formatted response of type `R`.

#### Implementation of

[`IResponseBuilder`](../../contracts/interfaces/IResponseBuilder.md).[`notFound`](../../contracts/interfaces/IResponseBuilder.md#notfound)

***

### ok()

> **ok**\<`T`\>(`data`): `APIGatewayProxyResult`

Defined in: [src/utils/response-builder/implementations/index.ts:26](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/response-builder/implementations/index.ts#L26)

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

`APIGatewayProxyResult`

A formatted response of type `R`.

#### Implementation of

[`IResponseBuilder`](../../contracts/interfaces/IResponseBuilder.md).[`ok`](../../contracts/interfaces/IResponseBuilder.md#ok)

***

### tooManyRequests()

> **tooManyRequests**(`message`, `details?`): `APIGatewayProxyResult`

Defined in: [src/utils/response-builder/implementations/index.ts:15](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/response-builder/implementations/index.ts#L15)

Returns an error response with status 429 (Too Many Requests).

#### Parameters

##### message

`string` = `'Too Many Requests'`

(Optional) Custom error message. Default: `'Too Many Requests'`.

##### details?

`unknown`

(Optional) Additional details about the error, such as retry-after time.

#### Returns

`APIGatewayProxyResult`

A formatted response of type `R`.

#### Implementation of

[`IResponseBuilder`](../../contracts/interfaces/IResponseBuilder.md).[`tooManyRequests`](../../contracts/interfaces/IResponseBuilder.md#toomanyrequests)
