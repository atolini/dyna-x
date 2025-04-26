# S3StorageService - AWS S3 Storage Implementation

This package provides a concrete implementation of the [`Storage Service`](../../contracts/README.md) using [AWS S3](https://aws.amazon.com/s3/) for file storage operations.

It fulfills the abstraction defined by the [`IStorageService`](../../contracts/README.md), enabling seamless integration with systems that require file upload, retrieval, deletion, and listing.

---

## ✨ Overview

- **Technology**: AWS S3
- **Implements**: [`IStorageService`](../../contracts/README.md)
- **Key Features**:
  - Upload files to an S3 bucket.
  - Retrieve files as Buffers.
  - Delete files from the S3 bucket.
  - List all files in the S3 bucket.

---

## 📁 Package Structure

```
s3-storage/
├── index.ts
├── s3-storage-service.test.ts
└── README.md
```

---

## 📘 Service Details

This service allows interacting with AWS S3 for file operations like upload, retrieve, delete, and listing.

### 1. `S3StorageService`

**Implements**: [`IStorageService`](../../contracts/README.md)

#### Methods

- `uploadFile(key: string, body: Buffer | Readable | string, contentType: string): Promise<void>`  
  Uploads a file to the specified S3 bucket.

- `getFile(key: string): Promise<Buffer>`  
  Retrieves a file from the S3 bucket as a Buffer. Throws a custom error if the file is not found.

- `deleteFile(key: string): Promise<void>`  
  Deletes a file from the S3 bucket.

- `listFiles(): Promise<string[]>`  
  Lists all files (object keys) in the S3 bucket.

---

## 🚀 Usage Example

```typescript
import { S3StorageService } from './s3-storage';
import { Readable } from 'stream';

const storage = new S3StorageService('my-bucket', 'us-east-1');

// Upload a file
const fileContent = Buffer.from('Hello, S3!');
await storage.uploadFile('path/to/file.txt', fileContent, 'text/plain');

// Retrieve a file
const file = await storage.getFile('path/to/file.txt');

// Delete a file
await storage.deleteFile('path/to/file.txt');

// List all files
const files = await storage.listFiles();
console.log(files);
```

---

## 📝 Custom Errors

- **`S3FileNotFoundError`**: Thrown when a file is not found in the S3 bucket.

---

## 📄 Related Links

- [`IStorageService Contract`](../../contracts/README.md)
- [AWS S3 Documentation](https://aws.amazon.com/s3/)

---

## 📢 Notes

- This implementation uses the AWS SDK v3 (`@aws-sdk/client-s3`).
- Ensure the S3 bucket is correctly configured in AWS before interacting with it.
- The `getFile` method returns the file as a Buffer; handle it appropriately for your use case.
