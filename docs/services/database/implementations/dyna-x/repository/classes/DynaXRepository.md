[**kernel**](../../../../../../README.md)

***

[kernel](../../../../../../modules.md) / [services/database/implementations/dyna-x/repository](../README.md) / DynaXRepository

# Class: DynaXRepository\<T\>

Defined in: [src/services/database/implementations/dyna-x/repository/index.ts:46](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/implementations/dyna-x/repository/index.ts#L46)

Generic repository for interacting with DynamoDB tables using a defined schema.
Provides methods for retrieving, inserting, updating, and deleting items.

## Type Parameters

### T

`T`

The type of item stored in the DynamoDB table.

## Implements

- [`IRepository`](../../../../contracts/repository/i-repository/interfaces/IRepository.md)\<`T`, [`Key`](../interfaces/Key.md), [`ConditionExpressionResult`](../../condition-builder/condition-expression-result/type-aliases/ConditionExpressionResult.md), [`UpdateExpressionResult`](../../update-builder/update-expression-result/type-aliases/UpdateExpressionResult.md)\>

## Constructors

### Constructor

> **new DynaXRepository**\<`T`\>(`schema`, `logger`, `region?`, `maxBatchItems?`): `DynaXRepository`\<`T`\>

Defined in: [src/services/database/implementations/dyna-x/repository/index.ts:63](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/implementations/dyna-x/repository/index.ts#L63)

Initializes the repository with a schema and a DynamoDB client.

#### Parameters

##### schema

[`DynaXSchema`](../../schema/classes/DynaXSchema.md)

The schema defining the table structure.

##### logger

[`ILogger`](../../../../../../utils/logger/contracts/interfaces/ILogger.md)\<`any`\>

The logger instance.

##### region?

`string`

(Optional) AWS region to configure the DynamoDB client.

##### maxBatchItems?

`number` = `1000`

(Optional) The maximum number of items allowed in one batch write.

#### Returns

`DynaXRepository`\<`T`\>

## Methods

### batchWriteItems()

> **batchWriteItems**(`putItems`, `deleteKeys?`): `Promise`\<`object`[]\>

Defined in: [src/services/database/implementations/dyna-x/repository/index.ts:170](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/implementations/dyna-x/repository/index.ts#L170)

Inserts or deletes multiple items in a single batch operation.
DynamoDB limits batch writes to 25 items per request.

#### Parameters

##### putItems

`T`[]

Items to be inserted or updated.

##### deleteKeys?

[`Key`](../interfaces/Key.md)[] = `[]`

Keys of items to be deleted.

#### Returns

`Promise`\<`object`[]\>

An array of unprocessed items, if any.

#### Implementation of

[`IRepository`](../../../../contracts/repository/i-repository/interfaces/IRepository.md).[`batchWriteItems`](../../../../contracts/repository/i-repository/interfaces/IRepository.md#batchwriteitems)

***

### deleteItem()

> **deleteItem**(`key`): `Promise`\<`void`\>

Defined in: [src/services/database/implementations/dyna-x/repository/index.ts:139](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/implementations/dyna-x/repository/index.ts#L139)

Deletes an item from the DynamoDB table based on the primary key.

#### Parameters

##### key

`Record`\<`string`, `any`\>

The key identifying the item to delete.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the item is deleted.

#### Implementation of

[`IRepository`](../../../../contracts/repository/i-repository/interfaces/IRepository.md).[`deleteItem`](../../../../contracts/repository/i-repository/interfaces/IRepository.md#deleteitem)

***

### getItem()

> **getItem**(`key`): `Promise`\<`T`\>

Defined in: [src/services/database/implementations/dyna-x/repository/index.ts:81](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/implementations/dyna-x/repository/index.ts#L81)

Retrieves an item from the DynamoDB table based on the primary key.

#### Parameters

##### key

`Record`\<`string`, `any`\>

The key identifying the item.

#### Returns

`Promise`\<`T`\>

The retrieved item, or null if not found.

#### Implementation of

[`IRepository`](../../../../contracts/repository/i-repository/interfaces/IRepository.md).[`getItem`](../../../../contracts/repository/i-repository/interfaces/IRepository.md#getitem)

***

### putItem()

> **putItem**(`item`): `Promise`\<`T`\>

Defined in: [src/services/database/implementations/dyna-x/repository/index.ts:110](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/implementations/dyna-x/repository/index.ts#L110)

Inserts or updates an item in the DynamoDB table.

#### Parameters

##### item

`T`

The item to be inserted or updated.

#### Returns

`Promise`\<`T`\>

The item updated.

#### Implementation of

[`IRepository`](../../../../contracts/repository/i-repository/interfaces/IRepository.md).[`putItem`](../../../../contracts/repository/i-repository/interfaces/IRepository.md#putitem)

***

### query()

> **query**(`condition`, `indexName?`): `Promise`\<`T`[]\>

Defined in: [src/services/database/implementations/dyna-x/repository/index.ts:268](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/implementations/dyna-x/repository/index.ts#L268)

Queries items from the DynamoDB table based on a condition.

#### Parameters

##### condition

[`ConditionBuilder`](../../condition-builder/classes/ConditionBuilder.md)

The condition to filter results.

##### indexName?

`string`

(Optional) The name of the index to query.

#### Returns

`Promise`\<`T`[]\>

A list of matching items or null if none found.

#### Implementation of

[`IRepository`](../../../../contracts/repository/i-repository/interfaces/IRepository.md).[`query`](../../../../contracts/repository/i-repository/interfaces/IRepository.md#query)

***

### update()

> **update**(`update`, `key`, `condition?`): `Promise`\<`T`\>

Defined in: [src/services/database/implementations/dyna-x/repository/index.ts:312](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/implementations/dyna-x/repository/index.ts#L312)

Updates an item in the DynamoDB table based on the provided key.

#### Parameters

##### update

[`UpdateBuilder`](../../update-builder/classes/UpdateBuilder.md)

The update definition.

##### key

[`Key`](../interfaces/Key.md)

The key identifying the item to update.

##### condition?

[`ConditionBuilder`](../../condition-builder/classes/ConditionBuilder.md)

(Optional) A condition to check before updating.

#### Returns

`Promise`\<`T`\>

The updated item or null if the operation fails.

#### Implementation of

[`IRepository`](../../../../contracts/repository/i-repository/interfaces/IRepository.md).[`update`](../../../../contracts/repository/i-repository/interfaces/IRepository.md#update)
