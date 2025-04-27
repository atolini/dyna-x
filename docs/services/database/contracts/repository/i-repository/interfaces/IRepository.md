[**kernel**](../../../../../../README.md)

***

[kernel](../../../../../../modules.md) / [services/database/contracts/repository/i-repository](../README.md) / IRepository

# Interface: IRepository\<T, K, C, U\>

Defined in: [src/services/database/contracts/repository/i-repository.ts:12](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/contracts/repository/i-repository.ts#L12)

Generic repository interface for database operations

## Type Parameters

### T

`T`

Type of the item to be managed in the database

### K

`K`

Type of the key used to identify items

### C

`C`

Type of the condition builder response (build result)

### U

`U`

Type of the update builder response (build result)

## Methods

### batchWriteItems()

> **batchWriteItems**(`putItems`, `deleteKeys?`): `Promise`\<`object`[]\>

Defined in: [src/services/database/contracts/repository/i-repository.ts:41](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/contracts/repository/i-repository.ts#L41)

Performs batch write operations (put and/or delete)

#### Parameters

##### putItems

`T`[]

Array of items to put

##### deleteKeys?

`K`[]

Optional array of keys to delete

#### Returns

`Promise`\<`object`[]\>

Array of operation results indicating success/failure

***

### deleteItem()

> **deleteItem**(`key`): `Promise`\<`void`\>

Defined in: [src/services/database/contracts/repository/i-repository.ts:32](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/contracts/repository/i-repository.ts#L32)

Deletes an item from the database

#### Parameters

##### key

`K`

The key of the item to delete

#### Returns

`Promise`\<`void`\>

Resolves when deletion is complete

***

### getItem()

> **getItem**(`key`): `Promise`\<`T`\>

Defined in: [src/services/database/contracts/repository/i-repository.ts:18](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/contracts/repository/i-repository.ts#L18)

Retrieves a single item by its key

#### Parameters

##### key

`K`

The key of the item to retrieve

#### Returns

`Promise`\<`T`\>

The retrieved item or null if not found

***

### putItem()

> **putItem**(`item`): `Promise`\<`T`\>

Defined in: [src/services/database/contracts/repository/i-repository.ts:25](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/contracts/repository/i-repository.ts#L25)

Creates or replaces an item in the database

#### Parameters

##### item

`T`

The item to store

#### Returns

`Promise`\<`T`\>

The stored item

***

### query()

> **query**(`condition`, `indexName?`): `Promise`\<`T`[]\>

Defined in: [src/services/database/contracts/repository/i-repository.ts:52](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/contracts/repository/i-repository.ts#L52)

Queries the database using conditions

#### Parameters

##### condition

[`IConditionBuilder`](../../../condition-builder/i-condition-builder/interfaces/IConditionBuilder.md)\<`C`\>

The query conditions

##### indexName?

`string`

Optional index name to query against

#### Returns

`Promise`\<`T`[]\>

Array of matching items or null if none found

***

### update()

> **update**(`update`, `key`, `condition?`): `Promise`\<`T`\>

Defined in: [src/services/database/contracts/repository/i-repository.ts:64](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/contracts/repository/i-repository.ts#L64)

Updates an existing item in the database

#### Parameters

##### update

[`IUpdateBuilder`](../../../update-builder/i-update-builder/interfaces/IUpdateBuilder.md)\<`U`\>

The update operations to perform

##### key

`K`

The key of the item to update

##### condition?

[`IConditionBuilder`](../../../condition-builder/i-condition-builder/interfaces/IConditionBuilder.md)\<`C`\>

Optional conditions for conditional update

#### Returns

`Promise`\<`T`\>

The updated item or null if update failed
