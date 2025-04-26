# 👥 CognitoUserService — AWS Cognito User Management via Interface

A concrete, provider-specific implementation of the `IUserService<T>` interface for managing users using **AWS Cognito User Pools**.  
Built with **interface-driven architecture**, allowing seamless replacement with other identity providers.

---

## 📦 Components Overview

### 1. `IUserService<T>`  
Defines the **contract** for user management providers.

### 2. `CognitoUserService<T>`  
Implements user creation, update, and deletion via AWS Cognito.

### 3. DTOs (`CreateUserInput`, `UpdateUserAttributesInput`, `DeleteUserInput`)  
Standardized input types shared across any `IUserService` implementation.

---

## 🧩 Interface: `IUserService<T>`

```ts
export interface IUserService<T> {
  createUser(input: CreateUserInput<T>): Promise<void>;
  updateUserAttributes(input: UpdateUserAttributesInput<T>): Promise<void>;
  deleteUser(input: DeleteUserInput): Promise<void>;
}
```

| Method               | Description                                            |
|----------------------|--------------------------------------------------------|
| `createUser`         | Registers a new user using custom attributes.          |
| `updateUserAttributes` | Updates existing user attributes.                   |
| `deleteUser`         | Deletes the user by login/username.                   |

> 🔁 **Extensible**: Implement this interface to support other providers like Firebase, Auth0, etc.

---

## ⚙️ Class: `CognitoUserService<T>`

```ts
export class CognitoUserService<T> implements IUserService<T> { ... }
```

### Constructor

```ts
new CognitoUserService(userPoolId: string, region: string)
```

| Param         | Type     | Description                             |
|---------------|----------|-----------------------------------------|
| `userPoolId`  | `string` | AWS Cognito User Pool ID                |
| `region`      | `string` | AWS region (e.g., `us-east-1`)         |

### Implements:

- `createUser`
- `updateUserAttributes`
- `deleteUser`

Internally uses the AWS SDK v3 `CognitoIdentityProviderClient`.

---

## 🛠️ Usage Example

```ts
import { CognitoUserService } from './CognitoUserService';
import { AttributeType } from '@aws-sdk/client-cognito-identity-provider';

const userService = new CognitoUserService<AttributeType>(
  'us-east-1_XXXXXXXXX',
  'us-east-1'
);

await userService.createUser({
  login: 'jane.doe@example.com',
  userAttributes: [
    { Name: 'email', Value: 'jane.doe@example.com' },
    { Name: 'name', Value: 'Jane Doe' }
  ],
  suppressMessage: true
});
```

---

## 🧾 DTOs

### `CreateUserInput<T>`

```ts
interface CreateUserInput<T> {
  login: string;
  userAttributes: T[];
  temporaryPassword?: string;
  suppressMessage?: boolean;
}
```

---

### `UpdateUserAttributesInput<T>`

```ts
interface UpdateUserAttributesInput<T> {
  id: string;
  userAttributes: T[];
}
```

---

### `DeleteUserInput`

```ts
interface DeleteUserInput {
  id: string;
}
```

---