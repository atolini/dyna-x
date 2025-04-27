[**kernel**](../../../../../../README.md)

***

[kernel](../../../../../../modules.md) / [services/database/implementations/dyna-x/schema](../README.md) / DynaXSchema

# Class: DynaXSchema

Defined in: [src/services/database/implementations/dyna-x/schema/index.ts:14](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/implementations/dyna-x/schema/index.ts#L14)

Represents the schema definition for a DynamoDB table, including table name configuration.
This class serves as the base for defining DynamoDB table structures and ensures proper key validation.

 DynaXSchema

## Example

```ts
// Basic usage:
const schema = new DynaXSchema({
  tableName: 'UsersTable'
});
console.log(schema.getTableName()); // 'UsersTable'
```

## Constructors

### Constructor

> **new DynaXSchema**(`data`): `DynaXSchema`

Defined in: [src/services/database/implementations/dyna-x/schema/index.ts:23](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/implementations/dyna-x/schema/index.ts#L23)

Creates an instance of DynaXSchema.

#### Parameters

##### data

Configuration object for the schema

###### tableName

`string`

The name of the DynamoDB table

#### Returns

`DynaXSchema`

## Methods

### getTableName()

> **getTableName**(): `string`

Defined in: [src/services/database/implementations/dyna-x/schema/index.ts:39](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/implementations/dyna-x/schema/index.ts#L39)

Retrieves the name of the DynamoDB table configured in this schema.

#### Returns

`string`

The name of the DynamoDB table

#### Example

```ts
const tableName = schema.getTableName();
// Use with DynamoDB client:
const params = {
  TableName: schema.getTableName(),
  // ...other parameters
};
```
