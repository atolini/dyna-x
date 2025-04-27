[**kernel**](../../../../README.md)

***

[kernel](../../../../modules.md) / [services/auth/contracts](../README.md) / IUserService

# Interface: IUserService\<T\>

Defined in: [src/services/auth/contracts/index.ts:46](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/auth/contracts/index.ts#L46)

Interface for user service operations such as creating, updating, and deleting users.

## Type Parameters

### T

`T`

The shape of user attributes used throughout the service.

## Methods

### createUser()

> **createUser**(`input`): `Promise`\<`void`\>

Defined in: [src/services/auth/contracts/index.ts:52](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/auth/contracts/index.ts#L52)

Creates a new user with the specified input.

#### Parameters

##### input

[`CreateUserInput`](CreateUserInput.md)\<`T`\>

The data required to create the user.

#### Returns

`Promise`\<`void`\>

***

### deleteUser()

> **deleteUser**(`input`): `Promise`\<`void`\>

Defined in: [src/services/auth/contracts/index.ts:66](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/auth/contracts/index.ts#L66)

Deletes a user by their unique identifier.

#### Parameters

##### input

[`DeleteUserInput`](DeleteUserInput.md)

The data required to delete the user.

#### Returns

`Promise`\<`void`\>

***

### updateUserAttributes()

> **updateUserAttributes**(`input`): `Promise`\<`void`\>

Defined in: [src/services/auth/contracts/index.ts:59](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/auth/contracts/index.ts#L59)

Updates the attributes of an existing user.

#### Parameters

##### input

[`UpdateUserAttributesInput`](UpdateUserAttributesInput.md)\<`T`\>

The data required to update the user.

#### Returns

`Promise`\<`void`\>
