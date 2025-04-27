[**kernel**](../../../../../../README.md)

***

[kernel](../../../../../../modules.md) / [services/database/implementations/dyna-x/update-builder](../README.md) / UpdateBuilder

# Class: UpdateBuilder

Defined in: [src/services/database/implementations/dyna-x/update-builder/index.ts:4](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/implementations/dyna-x/update-builder/index.ts#L4)

Interface for building update expressions for database operations

## Implements

- [`IUpdateBuilder`](../../../../contracts/update-builder/i-update-builder/interfaces/IUpdateBuilder.md)\<[`UpdateExpressionResult`](../update-expression-result/type-aliases/UpdateExpressionResult.md)\>

## Constructors

### Constructor

> **new UpdateBuilder**(): `UpdateBuilder`

#### Returns

`UpdateBuilder`

## Methods

### add()

> **add**(`field`, `value`): `UpdateBuilder`

Defined in: [src/services/database/implementations/dyna-x/update-builder/index.ts:21](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/implementations/dyna-x/update-builder/index.ts#L21)

Increments a numeric value (ADD operation)

#### Parameters

##### field

`string`

Name of the numeric field

##### value

`number`

Value to be added

#### Returns

`UpdateBuilder`

The UpdateBuilder instance for method chaining

#### Implementation of

[`IUpdateBuilder`](../../../../contracts/update-builder/i-update-builder/interfaces/IUpdateBuilder.md).[`add`](../../../../contracts/update-builder/i-update-builder/interfaces/IUpdateBuilder.md#add)

***

### build()

> **build**(): `object`

Defined in: [src/services/database/implementations/dyna-x/update-builder/index.ts:25](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/implementations/dyna-x/update-builder/index.ts#L25)

Builds the update expression for database

#### Returns

`object`

Object with formatted expressions

##### ExpressionAttributeNames

> **ExpressionAttributeNames**: `Record`\<`string`, `string`\>

##### ExpressionAttributeValues

> **ExpressionAttributeValues**: `Record`\<`string`, `any`\>

##### UpdateExpression

> **UpdateExpression**: `string`

#### Implementation of

[`IUpdateBuilder`](../../../../contracts/update-builder/i-update-builder/interfaces/IUpdateBuilder.md).[`build`](../../../../contracts/update-builder/i-update-builder/interfaces/IUpdateBuilder.md#build)

***

### remove()

> **remove**(`field`): `UpdateBuilder`

Defined in: [src/services/database/implementations/dyna-x/update-builder/index.ts:14](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/implementations/dyna-x/update-builder/index.ts#L14)

Removes a field (REMOVE operation)

#### Parameters

##### field

`string`

Name of the field to remove

#### Returns

`UpdateBuilder`

The UpdateBuilder instance for method chaining

#### Implementation of

[`IUpdateBuilder`](../../../../contracts/update-builder/i-update-builder/interfaces/IUpdateBuilder.md).[`remove`](../../../../contracts/update-builder/i-update-builder/interfaces/IUpdateBuilder.md#remove)

***

### set()

> **set**(`field`, `value`): `UpdateBuilder`

Defined in: [src/services/database/implementations/dyna-x/update-builder/index.ts:10](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/implementations/dyna-x/update-builder/index.ts#L10)

Sets a value for a field (SET operation)

#### Parameters

##### field

`string`

Name of the field to update

##### value

`any`

New value for the field

#### Returns

`UpdateBuilder`

The UpdateBuilder instance for method chaining

#### Implementation of

[`IUpdateBuilder`](../../../../contracts/update-builder/i-update-builder/interfaces/IUpdateBuilder.md).[`set`](../../../../contracts/update-builder/i-update-builder/interfaces/IUpdateBuilder.md#set)
