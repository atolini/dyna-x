# Handlebars Template Service

This package provides a simple service for compiling [Handlebars](https://handlebarsjs.com/) templates dynamically with runtime data.

It implements the [`ITemplateService`](../../contracts/README.md) contract to maintain consistency with other templating engines.

---

## ✨ Overview

- **Technology**: Handlebars.js
- **Implements**: [`ITemplateService`](../../contracts/README.md)
- **Key Features**:
  - Pre-compiles a Handlebars template once.
  - Dynamically injects runtime data into the compiled template.
  - Returns the final HTML string.

---

## 📁 Package Structure

```
handlebars-template/
├── index.ts
├── handlebars.test.ts
└── README.md
```

---

## 📘 Service Details

This service enables safe and dynamic HTML rendering using Handlebars templates by compiling a provided template string.

### 1. `Handlebars`

**Implements**: [`ITemplateService`](../../contracts/README.md)

#### Methods

- `constructor(templateString: string)`  
  Initializes the service with a raw Handlebars template string.

- `compile(data: Record<string, any>): string`  
  Compiles the pre-loaded template with the provided data and returns the resulting HTML string.

---

## 🚀 Usage Example

```typescript
import { Handlebars } from './handlebars';

const templateString = '<h1>Hello, {{name}}!</h1>';
const templateService = new Handlebars(templateString);

const result = templateService.compile({ name: 'Alice' });

console.log(result); // Output: <h1>Hello, Alice!</h1>
```

---

## 📄 Related Links

- [`ITemplateService Contract`](../../contracts/README.md)
- [Handlebars.js Documentation](https://handlebarsjs.com/)

---

## 📢 Notes

- The template is compiled once during service construction, optimizing runtime performance.
- Ensure the template string passed to the constructor is valid Handlebars syntax.
