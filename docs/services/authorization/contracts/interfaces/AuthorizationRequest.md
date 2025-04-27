[**kernel**](../../../../README.md)

***

[kernel](../../../../modules.md) / [services/authorization/contracts](../README.md) / AuthorizationRequest

# Interface: AuthorizationRequest\<A, I, C, R\>

Defined in: [src/services/authorization/contracts/index.ts:9](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/authorization/contracts/index.ts#L9)

Represents an authorization request for a specific resource.

## Type Parameters

### A

`A`

The type that identifies the action (e.g., 'read', 'delete').

### I

`I`

The type that identifies the identity or user (e.g., user ID).

### C

`C`

The type that identifies the context of the request (e.g., roles, environment, metadata).

### R

`R`

The type that identifies the resource (e.g., resource ID or ARN).

## Properties

### action

> **action**: `A`

Defined in: [src/services/authorization/contracts/index.ts:11](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/authorization/contracts/index.ts#L11)

***

### context?

> `optional` **context**: `C`

Defined in: [src/services/authorization/contracts/index.ts:12](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/authorization/contracts/index.ts#L12)

***

### entityId

> **entityId**: `I`

Defined in: [src/services/authorization/contracts/index.ts:10](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/authorization/contracts/index.ts#L10)

***

### resourceId

> **resourceId**: `R`

Defined in: [src/services/authorization/contracts/index.ts:13](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/authorization/contracts/index.ts#L13)
