# Abstraction Layer for Database Operations

This package provides a generic abstraction layer for database operations, including interfaces for repository patterns, conditional queries, and update expressions. It's designed to be flexible and extensible, supporting a wide variety of database implementations.

## ✨ Overview

The abstraction layer defines three core interfaces:

- `IRepository<T, K, C, U>` – Generic repository interface for basic CRUD and query operations.
- `IConditionBuilder<T>` – Interface for building conditional query expressions.
- `IUpdateBuilder<T>` – Interface for building update expressions.

These interfaces are intended to provide a consistent contract for database operations across different storage backends (e.g., DynamoDB, SQL, MongoDB, etc.).

---

## 📁 Package Structure

```
database/
└── contracts /
    ├── repository/
    │   └── i-repository.ts
    ├── condition-builder/
    │   └── i-condition-builder.ts
    └── update-builder/
        └── i-update-builder.ts
```

---

## 📘 Interface Details

### 1. `IRepository<T, K, C, U>`

Generic repository interface that encapsulates CRUD operations, queries, and conditional updates.

**Type Parameters:**

- `T` — Item type
- `K` — Key type used to identify items
- `C` — Condition build result type
- `U` — Update build result type

**Main Methods:**

- `getItem(key: K): Promise<T | null>`
- `putItem(item: T): Promise<T>`
- `deleteItem(key: K): Promise<void>`
- `batchWriteItems(putItems: T[], deleteKeys?: K[]): Promise<Array<{ type: 'put' | 'delete', item: T | K }>>`
- `query(condition: IConditionBuilder<C>, indexName?: string): Promise<T[] | null>`
- `update(update: IUpdateBuilder<U>, key: K, condition?: IConditionBuilder<C>): Promise<T | null>`

---

### 2. `IConditionBuilder<T>`

Fluent interface for constructing complex conditional expressions.

**Main Methods:**

- `eq(field: string, value: any)`
- `ne(field: string, value: any)`
- `gt(field: string, value: any)`
- `lt(field: string, value: any)`
- `and()`
- `or()`
- `build(): T`

---

### 3. `IUpdateBuilder<T>`

Fluent interface for creating structured update expressions.

**Main Methods:**

- `set(field: string, value: any)`
- `remove(field: string)`
- `add(field: string, value: number)`
- `build(): T`

---

## 🚀 Use Case

This package is ideal for projects that require:

- A consistent repository interface for interacting with various databases.
- Custom implementations of query and update logic using builders.
- Separation of concerns between business logic and data persistence.
