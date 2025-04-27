[**kernel**](../../../../../README.md)

***

[kernel](../../../../../modules.md) / [services/storage/implementations/s3](../README.md) / S3StorageService

# Class: S3StorageService

Defined in: [src/services/storage/implementations/s3/index.ts:20](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/storage/implementations/s3/index.ts#L20)

Implementation of IStorageService for AWS S3 storage.
Provides methods to upload, retrieve, delete, and list files in an S3 bucket.

## Example

```ts
const storage = new S3StorageService('us-east-1', 'my-bucket');
await storage.uploadFile('path/to/file.txt', 'content', 'text/plain');
```

## Implements

- [`IStorageService`](../../../contracts/interfaces/IStorageService.md)

## Constructors

### Constructor

> **new S3StorageService**(`bucketName`, `region?`): `S3StorageService`

Defined in: [src/services/storage/implementations/s3/index.ts:29](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/storage/implementations/s3/index.ts#L29)

Creates an instance of S3StorageService.

#### Parameters

##### bucketName

`string`

The name of the S3 bucket to operate on.

##### region?

`string`

The AWS region where the bucket is located (e.g., 'us-east-1').

#### Returns

`S3StorageService`

## Methods

### deleteFile()

> **deleteFile**(`key`): `Promise`\<`void`\>

Defined in: [src/services/storage/implementations/s3/index.ts:88](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/storage/implementations/s3/index.ts#L88)

Deletes a file from the S3 bucket.

#### Parameters

##### key

`string`

The object key (path) in the bucket.

#### Returns

`Promise`\<`void`\>

Resolves when the deletion is complete.

#### Throws

If the deletion fails.

#### Implementation of

[`IStorageService`](../../../contracts/interfaces/IStorageService.md).[`deleteFile`](../../../contracts/interfaces/IStorageService.md#deletefile)

***

### getFile()

> **getFile**(`key`): `Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

Defined in: [src/services/storage/implementations/s3/index.ts:62](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/storage/implementations/s3/index.ts#L62)

Retrieves a file from the S3 bucket as a Buffer.

#### Parameters

##### key

`string`

The object key (path) in the bucket.

#### Returns

`Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

The file content as a Buffer.

#### Throws

If the file doesn't exist or can't be read.

#### Implementation of

[`IStorageService`](../../../contracts/interfaces/IStorageService.md).[`getFile`](../../../contracts/interfaces/IStorageService.md#getfile)

***

### listFiles()

> **listFiles**(): `Promise`\<`string`[]\>

Defined in: [src/services/storage/implementations/s3/index.ts:102](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/storage/implementations/s3/index.ts#L102)

Lists all files in the S3 bucket.

#### Returns

`Promise`\<`string`[]\>

An array of object keys (paths) in the bucket.

#### Throws

If the listing operation fails.

#### Implementation of

[`IStorageService`](../../../contracts/interfaces/IStorageService.md).[`listFiles`](../../../contracts/interfaces/IStorageService.md#listfiles)

***

### uploadFile()

> **uploadFile**(`key`, `body`, `contentType`): `Promise`\<`void`\>

Defined in: [src/services/storage/implementations/s3/index.ts:41](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/storage/implementations/s3/index.ts#L41)

Uploads a file to the S3 bucket.

#### Parameters

##### key

`string`

The object key (path) in the bucket.

##### body

The file content to upload.

`string` | `Buffer`\<`ArrayBufferLike`\> | `Readable`

##### contentType

`string`

The MIME type of the file.

#### Returns

`Promise`\<`void`\>

Resolves when the upload is complete.

#### Implementation of

[`IStorageService`](../../../contracts/interfaces/IStorageService.md).[`uploadFile`](../../../contracts/interfaces/IStorageService.md#uploadfile)
