[**kernel**](../../../../../README.md)

***

[kernel](../../../../../modules.md) / [services/auth/implementations/cognito](../README.md) / CognitoUserService

# Class: CognitoUserService\<T\>

Defined in: [src/services/auth/implementations/cognito/index.ts:21](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/auth/implementations/cognito/index.ts#L21)

Service to manage users in AWS Cognito.

## Type Parameters

### T

`T` *extends* `AttributeType`

The format of the user attributes, must match Cognito's expected structure.

## Implements

- [`IUserService`](../../../contracts/interfaces/IUserService.md)\<`T`\>

## Constructors

### Constructor

> **new CognitoUserService**\<`T`\>(`userPoolId`, `region?`): `CognitoUserService`\<`T`\>

Defined in: [src/services/auth/implementations/cognito/index.ts:31](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/auth/implementations/cognito/index.ts#L31)

#### Parameters

##### userPoolId

`string`

Cognito User Pool ID where users will be managed.

##### region?

`string`

AWS region.

#### Returns

`CognitoUserService`\<`T`\>

## Methods

### createUser()

> **createUser**(`input`): `Promise`\<`void`\>

Defined in: [src/services/auth/implementations/cognito/index.ts:41](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/auth/implementations/cognito/index.ts#L41)

Creates a user in Cognito.

#### Parameters

##### input

[`CreateUserInput`](../../../contracts/interfaces/CreateUserInput.md)\<`T`\>

Information needed to create the user.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IUserService`](../../../contracts/interfaces/IUserService.md).[`createUser`](../../../contracts/interfaces/IUserService.md#createuser)

***

### deleteUser()

> **deleteUser**(`input`): `Promise`\<`void`\>

Defined in: [src/services/auth/implementations/cognito/index.ts:75](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/auth/implementations/cognito/index.ts#L75)

Deletes a user from Cognito.

#### Parameters

##### input

[`DeleteUserInput`](../../../contracts/interfaces/DeleteUserInput.md)

Information about the user to delete.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IUserService`](../../../contracts/interfaces/IUserService.md).[`deleteUser`](../../../contracts/interfaces/IUserService.md#deleteuser)

***

### updateUserAttributes()

> **updateUserAttributes**(`input`): `Promise`\<`void`\>

Defined in: [src/services/auth/implementations/cognito/index.ts:58](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/auth/implementations/cognito/index.ts#L58)

Updates user attributes in Cognito.

#### Parameters

##### input

[`UpdateUserAttributesInput`](../../../contracts/interfaces/UpdateUserAttributesInput.md)\<`T`\>

Information about the user and the attributes to update.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IUserService`](../../../contracts/interfaces/IUserService.md).[`updateUserAttributes`](../../../contracts/interfaces/IUserService.md#updateuserattributes)
