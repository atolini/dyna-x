# CognitoUserService - Auth Implementation

This package provides a concrete implementation of the [`Auth Service`](../../contracts/README.md) using [Amazon Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html) as the underlying engine.

It fulfills the abstraction defined by the [`IUserService<T>`](../../contracts/README.md), enabling integration with systems expecting a standardized service contract for user management operations.

---

## ✨ Overview

- **Technology**: Amazon Cognito
- **Implements**: [`IUserService<T>`](../../contracts/README.md)
- **Key Features**:
  - Create users in a Cognito User Pool.
  - Update user attributes.
  - Delete users from a User Pool.

---

## 📁 Package Structure

```
cognito/
├── index.ts
├── cognito-user-service.test.ts
└── README.md
```

---

## 📘 Service Details

This service is composed of a single main class that provides a full user management implementation for AWS Cognito.

### 1. `CognitoUserService`

**Implements**: [`IUserService<T>`](../../contracts/README.md)

**Main Methods:**

- `createUser(input: CreateUserInput<T>): Promise<void>` — Creates a new user in the specified Cognito User Pool.
- `updateUserAttributes(input: UpdateUserAttributesInput<T>): Promise<void>` — Updates user attributes for an existing user in the Cognito User Pool.
- `deleteUser(input: DeleteUserInput): Promise<void>` — Deletes a user from the Cognito User Pool.

---

## 🚀 Usage Example

```typescript
import { CognitoUserService } from './cognito';
import { AttributeType } from '@aws-sdk/client-cognito-identity-provider';

const userService = new CognitoUserService<AttributeType>(
  'your-user-pool-id',
  'your-region',
);

// Creating a user
await userService.createUser({
  login: 'example@example.com',
  temporaryPassword: 'TemporaryPassword123!',
  userAttributes: [
    { Name: 'email', Value: 'example@example.com' },
    { Name: 'name', Value: 'Example User' },
  ],
  suppressMessage: true,
});

// Updating user attributes
await userService.updateUserAttributes({
  id: 'example@example.com',
  userAttributes: [{ Name: 'custom:role', Value: 'admin' }],
});

// Deleting a user
await userService.deleteUser({
  id: 'example@example.com',
});
```

---

## 📄 Related Links

- [`IUserService<T>` Contract Interface](../../contracts/README.md)
- [Amazon Cognito Documentation](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html)

---

## 📢 Notes

- This implementation uses the AWS SDK v3 (`@aws-sdk/client-cognito-identity-provider`).
- Ensure that the Cognito User Pool is correctly configured before using the service.
- Future enhancements could include support for multi-factor authentication (MFA), user group management, and account status updates.
