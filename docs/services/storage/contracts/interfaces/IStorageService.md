[**kernel**](../../../../README.md)

***

[kernel](../../../../modules.md) / [services/storage/contracts](../README.md) / IStorageService

# Interface: IStorageService

Defined in: [src/services/storage/contracts/index.ts:3](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/storage/contracts/index.ts#L3)

## Methods

### deleteFile()

> **deleteFile**(`key`): `Promise`\<`void`\>

Defined in: [src/services/storage/contracts/index.ts:27](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/storage/contracts/index.ts#L27)

Deletes a file from the storage.

#### Parameters

##### key

`string`

The identifier (path) of the file in storage.

#### Returns

`Promise`\<`void`\>

***

### getFile()

> **getFile**(`key`): `Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

Defined in: [src/services/storage/contracts/index.ts:21](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/storage/contracts/index.ts#L21)

Retrieves a file from the storage.

#### Parameters

##### key

`string`

The identifier (path) of the file in storage.

#### Returns

`Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

The file content as a Buffer.

***

### listFiles()

> **listFiles**(`prefix?`): `Promise`\<`string`[]\>

Defined in: [src/services/storage/contracts/index.ts:34](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/storage/contracts/index.ts#L34)

Lists all files in the storage.

#### Parameters

##### prefix?

`string`

Optional prefix to filter files.

#### Returns

`Promise`\<`string`[]\>

An array of file identifiers (keys).

***

### uploadFile()

> **uploadFile**(`key`, `body`, `contentType`): `Promise`\<`void`\>

Defined in: [src/services/storage/contracts/index.ts:10](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/storage/contracts/index.ts#L10)

Uploads a file to the storage.

#### Parameters

##### key

`string`

The identifier (path) of the file in storage.

##### body

The content of the file (Buffer, Readable stream, or string).

`string` | `Buffer`\<`ArrayBufferLike`\> | `Readable`

##### contentType

`string`

The MIME type of the file.

#### Returns

`Promise`\<`void`\>
