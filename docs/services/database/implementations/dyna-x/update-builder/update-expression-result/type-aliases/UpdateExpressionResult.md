[**kernel**](../../../../../../../README.md)

***

[kernel](../../../../../../../modules.md) / [services/database/implementations/dyna-x/update-builder/update-expression-result](../README.md) / UpdateExpressionResult

# Type Alias: UpdateExpressionResult

> **UpdateExpressionResult** = `object`

Defined in: [src/services/database/implementations/dyna-x/update-builder/update-expression-result.ts:1](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/implementations/dyna-x/update-builder/update-expression-result.ts#L1)

## Properties

### ExpressionAttributeNames

> **ExpressionAttributeNames**: `Record`\<`string`, `string`\>

Defined in: [src/services/database/implementations/dyna-x/update-builder/update-expression-result.ts:12](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/implementations/dyna-x/update-builder/update-expression-result.ts#L12)

Mapping of expression attribute name placeholders to actual field names

#### Example

```ts
{ "#name": "username", "#age": "user_age" }
```

***

### ExpressionAttributeValues

> **ExpressionAttributeValues**: `Record`\<`string`, `any`\>

Defined in: [src/services/database/implementations/dyna-x/update-builder/update-expression-result.ts:18](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/implementations/dyna-x/update-builder/update-expression-result.ts#L18)

Mapping of expression value placeholders to their corresponding values

#### Example

```ts
{ ":value": { S: "john_doe" } }
```

***

### UpdateExpression

> **UpdateExpression**: `string`

Defined in: [src/services/database/implementations/dyna-x/update-builder/update-expression-result.ts:6](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/implementations/dyna-x/update-builder/update-expression-result.ts#L6)

The complete update expression string combining all operations

#### Example

```ts
"SET #name = :value REMOVE #age"
```
