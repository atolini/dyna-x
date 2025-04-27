[**kernel**](../../../../README.md)

***

[kernel](../../../../modules.md) / [utils/file-manager/contracts](../README.md) / IFileManager

# Interface: IFileManager

Defined in: [src/utils/file-manager/contracts/index.ts:4](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/file-manager/contracts/index.ts#L4)

Interface for file management operations.

## Methods

### deleteFile()

> **deleteFile**(`fileName`): `void`

Defined in: [src/utils/file-manager/contracts/index.ts:29](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/file-manager/contracts/index.ts#L29)

Deletes a specified file.

#### Parameters

##### fileName

`string`

The name of the file to delete.

#### Returns

`void`

***

### listFiles()

> **listFiles**(): `string`[]

Defined in: [src/utils/file-manager/contracts/index.ts:9](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/file-manager/contracts/index.ts#L9)

Lists all available files.

#### Returns

`string`[]

An array of file names.

***

### readFile()

> **readFile**(`fileName`): `string`

Defined in: [src/utils/file-manager/contracts/index.ts:16](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/file-manager/contracts/index.ts#L16)

Reads the content of a specified file.

#### Parameters

##### fileName

`string`

The name of the file to read.

#### Returns

`string`

The content of the file as a string.

***

### writeFile()

> **writeFile**(`fileName`, `content`): `void`

Defined in: [src/utils/file-manager/contracts/index.ts:23](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/file-manager/contracts/index.ts#L23)

Writes content to a specified file.

#### Parameters

##### fileName

`string`

The name of the file to write to.

##### content

`string`

The content to be written into the file.

#### Returns

`void`
