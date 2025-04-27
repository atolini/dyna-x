[**kernel**](../../../../../../README.md)

***

[kernel](../../../../../../modules.md) / [services/database/contracts/update-builder/i-update-builder](../README.md) / IUpdateBuilder

# Interface: IUpdateBuilder\<T\>

Defined in: [src/services/database/contracts/update-builder/i-update-builder.ts:5](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/contracts/update-builder/i-update-builder.ts#L5)

Interface for building update expressions for database operations

## Type Parameters

### T

`T`

Type of the result returned by the build() method

## Methods

### add()

> **add**(`field`, `value`): `IUpdateBuilder`\<`T`\>

Defined in: [src/services/database/contracts/update-builder/i-update-builder.ts:27](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/contracts/update-builder/i-update-builder.ts#L27)

Increments a numeric value (ADD operation)

#### Parameters

##### field

`string`

Name of the numeric field

##### value

`number`

Value to be added

#### Returns

`IUpdateBuilder`\<`T`\>

The UpdateBuilder instance for method chaining

***

### build()

> **build**(): `T`

Defined in: [src/services/database/contracts/update-builder/i-update-builder.ts:33](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/contracts/update-builder/i-update-builder.ts#L33)

Builds the update expression for database

#### Returns

`T`

Object with formatted expressions

***

### remove()

> **remove**(`field`): `IUpdateBuilder`\<`T`\>

Defined in: [src/services/database/contracts/update-builder/i-update-builder.ts:19](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/contracts/update-builder/i-update-builder.ts#L19)

Removes a field (REMOVE operation)

#### Parameters

##### field

`string`

Name of the field to remove

#### Returns

`IUpdateBuilder`\<`T`\>

The UpdateBuilder instance for method chaining

***

### set()

> **set**(`field`, `value`): `IUpdateBuilder`\<`T`\>

Defined in: [src/services/database/contracts/update-builder/i-update-builder.ts:12](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/contracts/update-builder/i-update-builder.ts#L12)

Sets a value for a field (SET operation)

#### Parameters

##### field

`string`

Name of the field to update

##### value

`any`

New value for the field

#### Returns

`IUpdateBuilder`\<`T`\>

The UpdateBuilder instance for method chaining
