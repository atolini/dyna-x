[**kernel**](../../../../../README.md)

***

[kernel](../../../../../modules.md) / [services/template/implementations/handlebars](../README.md) / TemplateService

# Class: TemplateService

Defined in: [src/services/template/implementations/handlebars/index.ts:7](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/template/implementations/handlebars/index.ts#L7)

Service responsible for compiling Handlebars templates.

## Implements

- [`ITemplateService`](../../../contracts/interfaces/ITemplateService.md)

## Constructors

### Constructor

> **new TemplateService**(`templateString`): `TemplateService`

Defined in: [src/services/template/implementations/handlebars/index.ts:14](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/template/implementations/handlebars/index.ts#L14)

Creates an instance of the template service.

#### Parameters

##### templateString

`string`

The raw Handlebars template as a string.

#### Returns

`TemplateService`

## Methods

### compile()

> **compile**(`data`): `string`

Defined in: [src/services/template/implementations/handlebars/index.ts:32](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/template/implementations/handlebars/index.ts#L32)

Compiles the template with the provided data.
If data is not provided, it will return the template without any values injected.

#### Parameters

##### data

`Record`\<`string`, `any`\>

An object containing the values to inject into the template.

#### Returns

`string`

The resulting HTML string.

#### Examples

```ts
const templateService = new TemplateService('<h1>{{title}}</h1>');
const result = templateService.compile({ title: 'Hello, World!' });
console.log(result); // Outputs: <h1>Hello, World!</h1>
```

```ts
const templateService = new TemplateService('<h1>{{title}}</h1>');
const result = templateService.compile();
console.log(result); // Outputs: <h1></h1>
```

#### Implementation of

[`ITemplateService`](../../../contracts/interfaces/ITemplateService.md).[`compile`](../../../contracts/interfaces/ITemplateService.md#compile)
