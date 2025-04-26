# Abstraction Layer for Template Service Operations

This package defines an abstraction for template services, standardizing the process of compiling templates into HTML strings based on dynamic data inputs.

## ✨ Overview

- `ITemplateService` — Interface defining the contract for compiling templates with provided data into HTML strings.

This interface ensures consistent behavior across different template engine implementations.

---

## 📁 Package Structure

```
template/
└── contracts/
    └── index.ts
```

---

## 📘 Interface Details

### 1. `ITemplateService`

**Main Methods:**

- `compile(data: Record<string, any>): string` — Compiles a template by injecting the provided data, returning the resulting HTML string.

---

## 🚀 Use Case

This abstraction allows different templating engines (e.g., Handlebars, EJS, custom engines) to be easily swapped or integrated without changing the core application logic.

For example:

- Implement a `HandlebarsTemplateService` that fulfills the `ITemplateService` interface using Handlebars as the engine.
- Create a mock template service for testing purposes, returning static HTML.
- Extend the system to support multi-engine rendering with minimal changes.

By following this contract, developers can maintain a clean separation between business logic and template rendering, improving flexibility and maintainability.
