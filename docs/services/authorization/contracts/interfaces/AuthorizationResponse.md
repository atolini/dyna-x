[**kernel**](../../../../README.md)

***

[kernel](../../../../modules.md) / [services/authorization/contracts](../README.md) / AuthorizationResponse

# Interface: AuthorizationResponse\<R\>

Defined in: [src/services/authorization/contracts/index.ts:33](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/authorization/contracts/index.ts#L33)

Represents the result of an individual authorization check.

## Type Parameters

### R

`R`

The type that identifies the resource.

## Properties

### decision

> **decision**: `"ALLOW"` \| `"DENY"`

Defined in: [src/services/authorization/contracts/index.ts:35](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/authorization/contracts/index.ts#L35)

***

### recourseId

> **recourseId**: `R`

Defined in: [src/services/authorization/contracts/index.ts:34](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/authorization/contracts/index.ts#L34)
