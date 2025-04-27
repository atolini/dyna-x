[**kernel**](../../../../README.md)

***

[kernel](../../../../modules.md) / [services/auth/contracts](../README.md) / CreateUserInput

# Interface: CreateUserInput\<T\>

Defined in: [src/services/auth/contracts/index.ts:6](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/auth/contracts/index.ts#L6)

Represents the input required to create a new user.

## Type Parameters

### T

`T`

The shape of each user attribute.

## Properties

### login

> **login**: `string`

Defined in: [src/services/auth/contracts/index.ts:8](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/auth/contracts/index.ts#L8)

The user's login name (usually email or username).

***

### suppressMessage?

> `optional` **suppressMessage**: `boolean`

Defined in: [src/services/auth/contracts/index.ts:17](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/auth/contracts/index.ts#L17)

If true, suppresses the automatic message sent to the user upon creation.

***

### temporaryPassword?

> `optional` **temporaryPassword**: `string`

Defined in: [src/services/auth/contracts/index.ts:14](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/auth/contracts/index.ts#L14)

Optional temporary password to be assigned to the user.

***

### userAttributes

> **userAttributes**: `T`[]

Defined in: [src/services/auth/contracts/index.ts:11](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/auth/contracts/index.ts#L11)

A list of user attributes to assign to the user.
