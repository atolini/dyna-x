[**kernel**](../../../../README.md)

***

[kernel](../../../../modules.md) / [services/auth/contracts](../README.md) / UpdateUserAttributesInput

# Interface: UpdateUserAttributesInput\<T\>

Defined in: [src/services/auth/contracts/index.ts:25](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/auth/contracts/index.ts#L25)

Represents the input required to update an existing user's attributes.

## Type Parameters

### T

`T`

The shape of each user attribute.

## Properties

### id

> **id**: `string`

Defined in: [src/services/auth/contracts/index.ts:27](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/auth/contracts/index.ts#L27)

The unique identifier of the user to update.

***

### userAttributes

> **userAttributes**: `T`[]

Defined in: [src/services/auth/contracts/index.ts:30](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/auth/contracts/index.ts#L30)

A list of updated user attributes.
