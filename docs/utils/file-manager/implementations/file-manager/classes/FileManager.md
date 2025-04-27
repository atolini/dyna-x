[**kernel**](../../../../../README.md)

***

[kernel](../../../../../modules.md) / [utils/file-manager/implementations/file-manager](../README.md) / FileManager

# Class: FileManager

Defined in: [src/utils/file-manager/implementations/file-manager/index.ts:8](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/file-manager/implementations/file-manager/index.ts#L8)

Manages file operations within a specified directory.

## Implements

- [`IFileManager`](../../../contracts/interfaces/IFileManager.md)

## Constructors

### Constructor

> **new FileManager**(`relativePath`): `FileManager`

Defined in: [src/utils/file-manager/implementations/file-manager/index.ts:16](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/file-manager/implementations/file-manager/index.ts#L16)

Initializes the FileManager with a given directory path.
If the directory does not exist, it is created.

#### Parameters

##### relativePath

`string`

The relative path of the directory to manage.

#### Returns

`FileManager`

## Methods

### deleteFile()

> **deleteFile**(`fileName`): `void`

Defined in: [src/utils/file-manager/implementations/file-manager/index.ts:59](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/file-manager/implementations/file-manager/index.ts#L59)

Deletes a specified file if it exists.

#### Parameters

##### fileName

`string`

The name of the file to delete.

#### Returns

`void`

#### Implementation of

[`IFileManager`](../../../contracts/interfaces/IFileManager.md).[`deleteFile`](../../../contracts/interfaces/IFileManager.md#deletefile)

***

### listFiles()

> **listFiles**(): `string`[]

Defined in: [src/utils/file-manager/implementations/file-manager/index.ts:28](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/file-manager/implementations/file-manager/index.ts#L28)

Lists all files in the managed directory.

#### Returns

`string`[]

An array containing the names of all files in the directory.

#### Implementation of

[`IFileManager`](../../../contracts/interfaces/IFileManager.md).[`listFiles`](../../../contracts/interfaces/IFileManager.md#listfiles)

***

### readFile()

> **readFile**(`fileName`): `string`

Defined in: [src/utils/file-manager/implementations/file-manager/index.ts:37](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/file-manager/implementations/file-manager/index.ts#L37)

Reads the content of a specified file.

#### Parameters

##### fileName

`string`

The name of the file to read.

#### Returns

`string`

The file content as a string, or `null` if the file does not exist.

#### Implementation of

[`IFileManager`](../../../contracts/interfaces/IFileManager.md).[`readFile`](../../../contracts/interfaces/IFileManager.md#readfile)

***

### writeFile()

> **writeFile**(`fileName`, `content`): `void`

Defined in: [src/utils/file-manager/implementations/file-manager/index.ts:50](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/utils/file-manager/implementations/file-manager/index.ts#L50)

Writes content to a specified file. Creates the file if it does not exist.

#### Parameters

##### fileName

`string`

The name of the file.

##### content

`string`

The content to write to the file.

#### Returns

`void`

#### Implementation of

[`IFileManager`](../../../contracts/interfaces/IFileManager.md).[`writeFile`](../../../contracts/interfaces/IFileManager.md#writefile)
