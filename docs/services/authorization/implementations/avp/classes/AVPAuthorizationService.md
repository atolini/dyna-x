[**kernel**](../../../../../README.md)

***

[kernel](../../../../../modules.md) / [services/authorization/implementations/avp](../README.md) / AVPAuthorizationService

# Class: AVPAuthorizationService

Defined in: [src/services/authorization/implementations/avp/index.ts:25](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/authorization/implementations/avp/index.ts#L25)

Service implementation using Amazon Verified Permissions for authorization checks.

## Template

Type representing the identity.

## Template

Type representing the context.

## Template

Type representing the resource.

## Implements

- [`IAuthorizationService`](../../../contracts/interfaces/IAuthorizationService.md)\<`ActionIdentifier`, `EntityIdentifier`, `ContextDefinition`, `EntityIdentifier`\>

## Constructors

### Constructor

> **new AVPAuthorizationService**(`policyStoreId`): `AVPAuthorizationService`

Defined in: [src/services/authorization/implementations/avp/index.ts:37](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/authorization/implementations/avp/index.ts#L37)

#### Parameters

##### policyStoreId

`string`

#### Returns

`AVPAuthorizationService`

## Methods

### batchIsAuthorized()

> **batchIsAuthorized**(`request`): `Promise`\<[`BatchAuthorizationResponse`](../../../contracts/interfaces/BatchAuthorizationResponse.md)\<`EntityIdentifier`\>\>

Defined in: [src/services/authorization/implementations/avp/index.ts:80](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/authorization/implementations/avp/index.ts#L80)

Checks if a principal is authorized for multiple actions on multiple resources.

#### Parameters

##### request

[`BatchAuthorizationRequest`](../../../contracts/interfaces/BatchAuthorizationRequest.md)\<`ActionIdentifier`, `EntityIdentifier`, `ContextDefinition`, `EntityIdentifier`\>

The batch authorization request containing multiple authorization requests.

#### Returns

`Promise`\<[`BatchAuthorizationResponse`](../../../contracts/interfaces/BatchAuthorizationResponse.md)\<`EntityIdentifier`\>\>

A promise that resolves to a batch authorization response.

#### Implementation of

[`IAuthorizationService`](../../../contracts/interfaces/IAuthorizationService.md).[`batchIsAuthorized`](../../../contracts/interfaces/IAuthorizationService.md#batchisauthorized)

***

### isAuthorized()

> **isAuthorized**(`request`): `Promise`\<[`AuthorizationResponse`](../../../contracts/interfaces/AuthorizationResponse.md)\<`EntityIdentifier`\>\>

Defined in: [src/services/authorization/implementations/avp/index.ts:48](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/authorization/implementations/avp/index.ts#L48)

Checks if a principal is authorized for a specific action on a resource.

#### Parameters

##### request

[`AuthorizationRequest`](../../../contracts/interfaces/AuthorizationRequest.md)\<`ActionIdentifier`, `EntityIdentifier`, `ContextDefinition`, `EntityIdentifier`\>

The authorization request containing the principal, action, resource, and context.

#### Returns

`Promise`\<[`AuthorizationResponse`](../../../contracts/interfaces/AuthorizationResponse.md)\<`EntityIdentifier`\>\>

A promise that resolves to an authorization response.

#### Implementation of

[`IAuthorizationService`](../../../contracts/interfaces/IAuthorizationService.md).[`isAuthorized`](../../../contracts/interfaces/IAuthorizationService.md#isauthorized)
