# AVPAuthorizationService - Authorization Implementation

This package provides a concrete implementation of the [`Authorization Service`](../../contracts/README.md) using [Amazon Verified Permissions](https://aws.amazon.com/verified-permissions/) as the underlying engine for authorization checks.

It fulfills the abstraction defined by the [`Authorization Service`](../../contracts/README.md), enabling integration with systems expecting a standardized service contract for authorization decisions.

---

## ✨ Overview

- **Technology**: Amazon Verified Permissions
- **Implements**: [`Authorization Service`](../../contracts/README.md)
- **Key Features**:
  - Perform individual authorization checks.
  - Perform batch authorization checks for multiple requests.

---

## 📁 Package Structure

```
verified-permissions/
├── index.ts
├── avp-authorization-service.test.ts
└── README.md
```

---

## 📘 Service Details

This service is composed of a single main class that provides a full authorization implementation using Amazon Verified Permissions.

### 1. `AVPAuthorizationService`

**Implements**: [`IAuthorizationService<ActionIdentifier, EntityIdentifier, ContextDefinition, EntityIdentifier>`](../../contracts/README.md)

**Main Methods:**

- `isAuthorized(request: AuthorizationRequest<ActionIdentifier, EntityIdentifier, ContextDefinition, EntityIdentifier>): Promise<AuthorizationResponse<EntityIdentifier>>` — Checks if a specific entity is authorized to perform an action on a resource, given the context.
- `batchIsAuthorized(request: BatchAuthorizationRequest<ActionIdentifier, EntityIdentifier, ContextDefinition, EntityIdentifier>): Promise<BatchAuthorizationResponse<EntityIdentifier>>` — Checks if multiple entities are authorized to perform actions on multiple resources in a single batch request.

---

## 🚀 Usage Example

```typescript
import { AVPAuthorizationService } from './verified-permissions';
import {
  ActionIdentifier,
  EntityIdentifier,
  ContextDefinition,
} from '@aws-sdk/client-verifiedpermissions';

const authorizationService = new AVPAuthorizationService(
  'your-policy-store-id',
);

// Single authorization check
const authResponse = await authorizationService.isAuthorized({
  resourceId: 'resource-123',
  entityId: 'entity-456',
  context: {
    /* your context here */
  },
  action: 'read',
});

console.log(authResponse.decision); // "ALLOW" or "DENY"

// Batch authorization check
const batchAuthResponse = await authorizationService.batchIsAuthorized({
  requests: [
    {
      resourceId: 'resource-123',
      entityId: 'entity-456',
      context: {
        /* your context here */
      },
      action: 'read',
    },
    {
      resourceId: 'resource-789',
      entityId: 'entity-101',
      context: {
        /* your context here */
      },
      action: 'write',
    },
  ],
});

console.log(batchAuthResponse.results); // Array of authorization decisions
```

---

## 📄 Related Links

- [`Authorization Service Contract Interface`](../../contracts/README.md)
- [Amazon Verified Permissions Documentation](https://aws.amazon.com/verified-permissions/)

---

## 📢 Notes

- This implementation uses the AWS SDK v3 (`@aws-sdk/client-verifiedpermissions`).
- Make sure to configure the Amazon Verified Permissions policy store correctly before using the service.
- Future enhancements may include more complex context and action validation.
