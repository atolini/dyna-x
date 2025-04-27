[**kernel**](../../../../README.md)

***

[kernel](../../../../modules.md) / [services/template/contracts](../README.md) / ITemplateService

# Interface: ITemplateService

Defined in: [src/services/template/contracts/index.ts:4](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/template/contracts/index.ts#L4)

Interface that defines the contract for template services.

## Methods

### compile()

> **compile**(`data`): `string`

Defined in: [src/services/template/contracts/index.ts:10](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/template/contracts/index.ts#L10)

Compiles the template with the provided data.

#### Parameters

##### data

`Record`\<`string`, `any`\>

An object containing the values to inject into the template.

#### Returns

`string`

The generated HTML string.
