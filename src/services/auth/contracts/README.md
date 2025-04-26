# Abstraction Layer for User Service Operations

This package defines a set of interfaces that establish a standard abstraction for managing user operations such as creation, updating, and deletion.  
It is designed to allow flexibility in the shape of user attributes while maintaining consistency across different implementations of user services.

## ✨ Overview

- `CreateUserInput<T>` — DTO for the user creation operation.
- `UpdateUserAttributesInput<T>` — DTO for the user update operation.
- `DeleteUserInput` — DTO for the user deletion operation.
- `IUserService<T>` — Generic interface for user operations, including creation, updating, and deletion.

These interfaces provide a consistent contract for user operations across different user pool providers (e.g., Cognito, Azure AD, etc.).

---

## 📁 Package Structure

```
auth/
└── contracts/
    └── index.ts
```

---

## 📘 Interface Details

### 1. `CreateUserInput<T>`

**Type Parameters:**

- `T` — Defines the shape of each user attribute.

**Main Fields:**

- `login: string` — The user's login name (e.g., email or username).
- `userAttributes: T[]` — A list of attributes to assign to the user.
- `temporaryPassword?: string` — (Optional) A temporary password.
- `suppressMessage?: boolean` — (Optional) Suppresses automatic messages upon user creation.

---

### 2. `UpdateUserAttributesInput<T>`

**Type Parameters:**

- `T` — Defines the shape of each user attribute.

**Main Fields:**

- `id: string` — Unique identifier of the user to be updated.
- `userAttributes: T[]` — A list of updated attributes for the user.

---

### 3. `DeleteUserInput`

**Main Fields:**

- `id: string` — Unique identifier of the user to be deleted.

---

### 4. `IUserService<T>`

**Type Parameters:**

- `T` — Defines the shape of user attributes used throughout the service.

**Main Methods:**

- `createUser(input: CreateUserInput<T>): Promise<void>` — Creates a new user.
- `updateUserAttributes(input: UpdateUserAttributesInput<T>): Promise<void>` — Updates the attributes of an existing user.
- `deleteUser(input: DeleteUserInput): Promise<void>` — Deletes a user by their ID.

---

## 🚀 Use Case

This abstraction layer can be used to define a consistent contract for any user management system, regardless of the underlying provider (e.g., AWS Cognito, custom databases, third-party identity providers).

For example:

- Implement a `CognitoUserService` that fulfills the `IUserService<T>` interface, using AWS Cognito APIs.
- Implement a `DatabaseUserService` that interacts with a relational or NoSQL database.
- Create mock implementations of the user service for unit testing without depending on actual infrastructure.

By following these interfaces, multiple services can operate uniformly, making the system easier to scale, replace, or extend.
