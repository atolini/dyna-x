[**kernel**](../../../../README.md)

***

[kernel](../../../../modules.md) / [services/authorization/contracts](../README.md) / BatchAuthorizationRequest

# Interface: BatchAuthorizationRequest\<A, I, C, R\>

Defined in: [src/services/authorization/contracts/index.ts:24](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/authorization/contracts/index.ts#L24)

Represents a batch of authorization requests.

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

## Properties

### requests

> **requests**: [`AuthorizationRequest`](AuthorizationRequest.md)\<`A`, `I`, `C`, `R`\>[]

Defined in: [src/services/authorization/contracts/index.ts:25](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/authorization/contracts/index.ts#L25)
