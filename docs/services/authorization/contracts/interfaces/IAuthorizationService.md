[**kernel**](../../../../README.md)

***

[kernel](../../../../modules.md) / [services/authorization/contracts](../README.md) / IAuthorizationService

# Interface: IAuthorizationService\<A, I, C, R\>

Defined in: [src/services/authorization/contracts/index.ts:55](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/authorization/contracts/index.ts#L55)

Interface for an authorization service that validates whether identities are allowed to perform actions on resources.

## Type Parameters

### A

`A`

The type that identifies the action.

### I

`I`

The type that identifies the identity.

### C

`C`

The type that identifies the context.

### R

`R`

The type that identifies the resource.

## Methods

### batchIsAuthorized()

> **batchIsAuthorized**(`request`): `Promise`\<[`BatchAuthorizationResponse`](BatchAuthorizationResponse.md)\<`R`\>\>

Defined in: [src/services/authorization/contracts/index.ts:72](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/authorization/contracts/index.ts#L72)

Validates a batch of authorization requests in a single operation.

#### Parameters

##### request

[`BatchAuthorizationRequest`](BatchAuthorizationRequest.md)\<`A`, `I`, `C`, `R`\>

The batch of authorization requests.

#### Returns

`Promise`\<[`BatchAuthorizationResponse`](BatchAuthorizationResponse.md)\<`R`\>\>

A promise resolving to the batch authorization results.

***

### isAuthorized()

> **isAuthorized**(`request`): `Promise`\<[`AuthorizationResponse`](AuthorizationResponse.md)\<`R`\>\>

Defined in: [src/services/authorization/contracts/index.ts:62](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/authorization/contracts/index.ts#L62)

Validates whether the given identity is authorized to perform the specified action on the resource.

#### Parameters

##### request

[`AuthorizationRequest`](AuthorizationRequest.md)\<`A`, `I`, `C`, `R`\>

The authorization request.

#### Returns

`Promise`\<[`AuthorizationResponse`](AuthorizationResponse.md)\<`R`\>\>

A promise resolving to the result of the authorization check.
