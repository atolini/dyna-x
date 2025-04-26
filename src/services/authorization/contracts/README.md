# Abstraction Layer for Authorization Service Operations

This package defines a set of interfaces that establish a standard abstraction for performing authorization checks on resources.  
It is designed to provide flexibility in how actions, identities, contexts, and resources are represented, while ensuring consistency across different authorization service implementations.

## ✨ Overview

- `AuthorizationRequest<A, I, C, R>` — DTO for a single authorization request.
- `BatchAuthorizationRequest<A, I, C, R>` — DTO for a batch of authorization requests.
- `AuthorizationResponse<R>` — DTO for the result of a single authorization check.
- `BatchAuthorizationResponse<R>` — DTO for the result of a batch authorization check.
- `IAuthorizationService<A, I, C, R>` — Generic interface for validating authorization requests individually or in batches.

These interfaces provide a consistent contract for authorization services across different security models and providers.

---

## 📁 Package Structure

```
auth/
└── contracts/
    └── index.ts
```

---

## 📘 Interface Details

### 1. `AuthorizationRequest<A, I, C, R>`

**Type Parameters:**

- `A` — Defines the type of the action to be performed (e.g., 'read', 'delete').
- `I` — Defines the type of the identity requesting access (e.g., user ID).
- `C` — Defines the type of the context associated with the request (e.g., roles, environment).
- `R` — Defines the type of the resource being accessed (e.g., resource ID or ARN).

**Main Fields:**

- `entityId: I` — The identity making the request.
- `action: A` — The action the identity wants to perform.
- `context?: C` — (Optional) Additional context for the authorization decision.
- `resourceId: R` — The resource on which the action is to be performed.

---

### 2. `BatchAuthorizationRequest<A, I, C, R>`

**Type Parameters:**

- `A`, `I`, `C`, `R` — Same as in `AuthorizationRequest`.

**Main Fields:**

- `requests: AuthorizationRequest<A, I, C, R>[]` — A list of authorization requests to validate in batch.

---

### 3. `AuthorizationResponse<R>`

**Type Parameters:**

- `R` — Defines the type of the resource being authorized.

**Main Fields:**

- `recourseId: R` — The resource associated with the decision. _(Note: Likely a typo in the interface — should be `resourceId` instead of `recourseId`.)_
- `decision: 'ALLOW' | 'DENY'` — The result of the authorization check.

---

### 4. `BatchAuthorizationResponse<R>`

**Type Parameters:**

- `R` — Same as in `AuthorizationResponse`.

**Main Fields:**

- `results: AuthorizationResponse<R>[]` — A list of authorization results.

---

### 5. `IAuthorizationService<A, I, C, R>`

**Type Parameters:**

- `A` — Defines the type of action.
- `I` — Defines the type of identity.
- `C` — Defines the type of context.
- `R` — Defines the type of resource.

**Main Methods:**

- `isAuthorized(request: AuthorizationRequest<A, I, C, R>): Promise<AuthorizationResponse<R>>` — Validates if a specific action is allowed for a given identity and resource.
- `batchIsAuthorized(request: BatchAuthorizationRequest<A, I, C, R>): Promise<BatchAuthorizationResponse<R>>` — Validates multiple authorization requests in a single operation.

---

## 🚀 Use Case

This abstraction layer can be used to define a consistent authorization contract for any system where identities interact with resources, regardless of the underlying security model or provider.

For example:

- Implement an `IAMAuthorizationService` that fulfills the `IAuthorizationService<A, I, C, R>` interface using AWS IAM policies.
- Implement a `DatabaseAuthorizationService` that checks permissions stored in a relational database.
- Mock authorization service implementations for unit testing without needing a real identity provider or resource model.

By following these interfaces, systems can perform authorization uniformly, making it easier to scale, migrate, or extend authorization mechanisms.
