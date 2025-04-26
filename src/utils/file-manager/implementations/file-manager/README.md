---
# 📁 FileManager

A simple, local file management utility for Node.js environments.
Follows a clean interface-driven architecture that enables easy **extension** and **replacement** — for example, switching to cloud storage or mocking file operations in tests.
---

## 📚 Table of Contents

- [Overview](#overview)
- [Interface: IFileManager](#interface-ifilemanager)
- [Class: FileManager](#class-filemanager)
- [Usage Example](#usage-example)
- [Extending or Replacing](#extending-or-replacing)
- [Type Safety](#type-safety)

---

## 🔍 Overview

The `FileManager` class provides synchronous operations for managing files in a specified directory.  
Key features:

- Auto-creates the target directory if it does not exist.
- Provides full control over file lifecycle: list, read, write, delete.
- Built on top of Node's native `fs` and `path` modules.
- Adheres to the `IFileManager` interface for maximum flexibility.

---

## 🧩 Interface: `IFileManager`

Defines a minimal and consistent contract for any file management system.

```ts
/**
 * Interface for file management operations.
 */
export interface IFileManager {
  listFiles(): string[];
  readFile(fileName: string): string;
  writeFile(fileName: string, content: string): void;
  deleteFile(fileName: string): void;
}
```

🔁 This design allows for alternate implementations — e.g., `InMemoryFileManager`, `S3FileManager`, or even test mocks — without modifying dependent code.

---

## 🏗 Class: `FileManager`

### Constructor

```ts
new FileManager(relativePath: string)
```

Initializes a new `FileManager` scoped to a local directory.  
The directory will be created if it doesn't already exist.

| Param          | Type     | Description                                       |
| -------------- | -------- | ------------------------------------------------- |
| `relativePath` | `string` | Relative path from the current working directory. |

---

### Methods

#### `listFiles(): string[]`

Lists all files in the managed directory.

#### `readFile(fileName: string): string | null`

Reads a file's content as a UTF-8 string. Returns `null` if the file does not exist.

#### `writeFile(fileName: string, content: string): void`

Writes content to a file. If the file does not exist, it will be created.

#### `deleteFile(fileName: string): void`

Deletes a file if it exists. No error is thrown if the file is not found.

---

## 💡 Usage Example

```ts
import { FileManager } from './file-manager';

const fm = new FileManager('./data');

fm.writeFile('example.txt', 'Hello, world!');
console.log(fm.readFile('example.txt')); // "Hello, world!"
console.log(fm.listFiles()); // ["example.txt"]

fm.deleteFile('example.txt');
```

---

## 🔧 Extending or Replacing

To create your own file manager — for instance, using cloud storage or mocking for testing — simply implement the `IFileManager` interface:

```ts
class InMemoryFileManager implements IFileManager {
  private store = new Map<string, string>();

  listFiles(): string[] {
    return [...this.store.keys()];
  }

  readFile(fileName: string): string | null {
    return this.store.get(fileName) ?? null;
  }

  writeFile(fileName: string, content: string): void {
    this.store.set(fileName, content);
  }

  deleteFile(fileName: string): void {
    this.store.delete(fileName);
  }
}
```

---

## 🔒 Type Safety

By programming against the interface `IFileManager`, you make your services easier to:

- Test in isolation (with mocks or in-memory versions).
- Swap to other storage backends.
- Comply with **SOLID** principles — especially **Dependency Inversion**.

---
