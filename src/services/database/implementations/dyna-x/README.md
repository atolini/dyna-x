# DynaX - Database Implementation

DynaX provides a high-level abstraction over Amazon DynamoDB, offering an easy-to-use interface for database operations like retrieval, insertion, and updates while ensuring safe and optimized queries.

This package provides a concrete implementation of the [`Database Service`](../../contracts/README.md) using [Amazon DynamoDB](https://aws.amazon.com/dynamodb/).

---

## ✨ Overview

This package implements three main components:

1. **DynaXRepository**: performs operations on DynamoDB

- Retrieve an item
- Insert an item
- Delete an item
- Batch insert or delete items
- Query items with flexible conditions
- Update an item with custom expressions

2. **ConditionBuilder**: builds conditions used in DynamoDB query functions

- Build key conditions for queries
- Build filter conditions for queries
- Bind expression attribute values
- Bind expression attribute names
- Simplify the construction of DynamoDB expressions

3. **UpdateBuilder**: constructs the update expression and parameters used in the DynamoDB update operation

- Set attributes
- Remove attributes
- Increment numeric attributes
- Build complete update expressions
- Facilitate safe and dynamic updates

---

## 📁 Package Structure

```
dyna-x /
├── condition-builder
│   ├── condition-expression-result.ts
│   └── index.ts
├── errors
│   └── max-item-exceeded-error.ts
├── repository
│   └── index.ts
├── schema
│   └── index.ts
├── update-builder
│   ├── index.ts
│   └── update-expression-result.ts
└── README.md
```

---

## 📘 Service Details

### 1. DynaXRepository

Provides high-level operations for DynamoDB tables following the repository pattern.

**Implements**: [`IRepository`](../../../contracts/repository/i-repository.ts)

**Methods**:

- `constructor(schema: DynaXSchema, logger: ILogger<any>, region?: string, maxBatchItems?: number)`  
  Initializes the repository with a schema, logger, DynamoDB region, and an optional batch size limit for batch operations.
- `getItem(key: Record<string, any>): Promise<T | null>`  
  Retrieves an item from the DynamoDB table using the provided primary key.

- `putItem(item: T): Promise<T>`  
  Inserts or updates an item in the DynamoDB table.

- `deleteItem(key: Record<string, any>): Promise<void>`  
  Deletes an item from the DynamoDB table using the provided key.

- `batchWriteItems(putItems: T[], deleteKeys?: Key[]): Promise<Array<{ type: 'put' | 'delete', item: T | Key }>>`  
  Performs a batch write operation to insert or delete multiple items. This function throws a MaxItemsExceededError if the number of items exceeds the value defined during the object construction (maxBatchItems). It returns the unprocessed items.

- `query(condition: ConditionBuilder, indexName?: string): Promise<T[] | null>`  
  Queries the DynamoDB table using a condition builder, with optional support for secondary indexes.

- `update(update: UpdateBuilder, key: Key, condition?: ConditionBuilder): Promise<T | null>`  
  Updates an item in the DynamoDB table using the provided update builder, key, and optional condition expression.

### 2. ConditionBuilder

**Implements**: [`IConditionBuilder`](../../../contracts/condition-builder/i-condition-builder.ts)

The `ConditionBuilder` class provides a fluent API to build DynamoDB query conditions, including support for equality, inequality, greater than, less than conditions, and logical operators (AND, OR). It simplifies the process of constructing conditions without manually dealing with DynamoDB's syntax for key conditions and filter expressions.

**Methods**:

- `eq(field: string, value: any): ConditionBuilder`  
  Adds an equality condition (`=`) to the query for a given field and value.

  **Example**:

  ```typescript
  conditionBuilder.eq('age', 30);
  ```

- `ne(field: string, value: any): ConditionBuilder`  
  Adds an inequality condition (`<>`) for a given field and value.

  **Example**:

  ```typescript
  conditionBuilder.ne('status', 'active');
  ```

- `gt(field: string, value: any): ConditionBuilder`  
  Adds a "greater than" condition (`>`) for a given field and value.

  **Example**:

  ```typescript
  conditionBuilder.gt('age', 30);
  ```

- `lt(field: string, value: any): ConditionBuilder`  
  Adds a "less than" condition (`<`) for a given field and value.

  **Example**:

  ```typescript
  conditionBuilder.lt('age', 30);
  ```

- `and(): ConditionBuilder`  
  Adds a logical `AND` operator between conditions.

  **Example**:

  ```typescript
  conditionBuilder.eq('status', 'active').and().gt('age', 30);
  ```

- `or(): ConditionBuilder`  
  Adds a logical `OR` operator between conditions.

  **Example**:

  ```typescript
  conditionBuilder.eq('status', 'active').or().lt('age', 30);
  ```

- `build(): ConditionExpressionResult`  
  Returns the final condition expression ready to be used in a DynamoDB query. It also includes the expression attribute names and values.

  **Returns**:

  ```typescript
  {
    ConditionExpression: string,
    ExpressionAttributeNames: Record<string, string>,
    ExpressionAttributeValues: Record<string, any>
  }
  ```

### 3. UpdateBuilder

**Implements**: [`IUpdateBuilder`](../../../contracts/update-builder/i-update-builder.ts)

The `UpdateBuilder` class provides a fluent API to build DynamoDB `UpdateExpression` for updating attributes in items. It supports operations such as setting attributes, removing attributes, and adding numeric values. This class simplifies the construction of update expressions, ensuring compatibility with DynamoDB's syntax.

**Methods**:

- `set(field: string, value: any): UpdateBuilder`  
  Adds a `SET` operation to update an attribute with a specific value.

  **Example**:

  ```typescript
  updateBuilder.set('age', 30);
  ```

- `remove(field: string): UpdateBuilder`  
  Adds a `REMOVE` operation to remove an attribute from the item.

  **Example**:

  ```typescript
  updateBuilder.remove('oldField');
  ```

- `add(field: string, value: number): UpdateBuilder`  
  Adds an `ADD` operation to increment a numeric attribute by a given value.

  **Example**:

  ```typescript
  updateBuilder.add('score', 10);
  ```

- `build(): UpdateExpressionResult`  
  Returns the final update expression, along with expression attribute names and values, ready to be used in a DynamoDB update operation.

  **Returns**:

  ```typescript
  {
    UpdateExpression: string,
    ExpressionAttributeNames: Record<string, string>,
    ExpressionAttributeValues: Record<string, any>
  }
  ```

### 4. MaxItemExceededError

Custom error thrown when attempting to batch write more items than allowed by DynamoDB limits (typically 25 items).  
Helps ensure that the repository enforces DynamoDB's batch write limitations.

Example:

```typescript
throw new MaxItemExceededError('Maximum batch size exceeded');
```

### 5. DynaXSchema

Utility class to define table name and optionally manage partition and sort keys configuration.
Simplifies schema management when initializing the repository.

**Methods:**

- `constructor(data: { tableName: string })`
  Initializes the schema with the DynamoDB table name.

- `getTableName(): string`
  Retrieves the name of the DynamoDB table configured in this schema.

---

## 🚀 Usage Example

```typescript
import { DynaXRepository } from './repository';
import { DynaXSchema } from '../schema';
import { Logger } from '../../../../utils/logger/logger';

const repository = new DynaXRepository(
  new DynaXSchema('YourTableName'),
  new Logger(),
  'us-east-1',
);

// Insert an item
await repository.putItem({ id: '1', name: 'John Doe' });

// Retrieve an item
const item = await repository.getItem({ id: '1' });

// Delete an item
await repository.deleteItem({ id: '1' });

// Query items
const items = await repository.query(
  new ConditionBuilder()
    .withKeyCondition('id = :id')
    .withExpressionAttributeValues({ ':id': '1' }),
);

// Update an item
await repository.update(new UpdateBuilder().set('name', 'Jane Doe'), {
  id: '1',
});
```

---

## 📄 Related Links

- [`IRepository Contract`](../../../contracts/repository/i-repository.ts)
- [`IConditionBuilder Contract`](../../../contracts/repository/i-condition-builder.ts)
- [`IUpdateBuilder Contract`](../../../contracts/repository/i-update-builder.ts)
- [AWS DynamoDB Documentation](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html)

---

## 📢 Notes

- Ensure that your table schema aligns with the primary keys used in your operations.
- Batch operations should not exceed DynamoDB's limit of 25 items per request.
- ConditionBuilder and UpdateBuilder allow flexible and safe expression building without manual query strings.
- The MaxItemExceededError ensures that invalid batch operations are caught early.
- Logger integration helps in monitoring and debugging operations easily.
