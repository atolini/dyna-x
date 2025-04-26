# Abstraction Layer for Storage Service Operations

This package defines an abstraction for file storage operations, allowing consistent interaction with different storage providers such as cloud storage services or local file systems.

## ✨ Overview

- `IStorageService` — Interface defining the contract for uploading, retrieving, deleting, and listing files in a storage system.

This interface promotes flexibility and uniformity across different storage implementations.

---

## 📁 Package Structure

```
storage/
└── contracts/
    └── index.ts
```

---

## 📘 Interface Details

### 1. `IStorageService`

**Main Methods:**

- `uploadFile(key: string, body: Buffer | Readable | string, contentType: string): Promise<void>` — Uploads a file to the storage with the specified key and content type.
- `getFile(key: string): Promise<Buffer>` — Retrieves a file from storage as a `Buffer`.
- `deleteFile(key: string): Promise<void>` — Deletes a file identified by its key.
- `listFiles(prefix?: string): Promise<string[]>` — Lists file keys in storage, optionally filtered by a prefix.

---

## 🚀 Use Case

This abstraction layer allows seamless integration with different types of storage backends without coupling the business logic to a specific provider.

For example:

- Implement an `S3StorageService` that fulfills the `IStorageService` interface by interacting with AWS S3.
- Implement a `LocalStorageService` that reads from and writes to the local file system.
- Create a mock storage service for unit testing without depending on actual storage services.

By adhering to this interface, systems gain flexibility, making it easier to switch providers or extend functionalities.
