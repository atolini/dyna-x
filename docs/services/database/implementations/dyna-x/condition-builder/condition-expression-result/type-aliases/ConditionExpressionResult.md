[**kernel**](../../../../../../../README.md)

***

[kernel](../../../../../../../modules.md) / [services/database/implementations/dyna-x/condition-builder/condition-expression-result](../README.md) / ConditionExpressionResult

# Type Alias: ConditionExpressionResult\<V\>

> **ConditionExpressionResult**\<`V`\> = `object`

Defined in: [src/services/database/implementations/dyna-x/condition-builder/condition-expression-result.ts:1](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/implementations/dyna-x/condition-builder/condition-expression-result.ts#L1)

## Type Parameters

### V

`V` = `any`

## Properties

### ConditionExpression

> **ConditionExpression**: `string`

Defined in: [src/services/database/implementations/dyna-x/condition-builder/condition-expression-result.ts:5](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/implementations/dyna-x/condition-builder/condition-expression-result.ts#L5)

The combined condition expression string

***

### ExpressionAttributeNames

> **ExpressionAttributeNames**: `Record`\<`string`, `string`\>

Defined in: [src/services/database/implementations/dyna-x/condition-builder/condition-expression-result.ts:10](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/implementations/dyna-x/condition-builder/condition-expression-result.ts#L10)

Object mapping expression placeholders to attribute names

***

### ExpressionAttributeValues

> **ExpressionAttributeValues**: `Record`\<`string`, `V`\>

Defined in: [src/services/database/implementations/dyna-x/condition-builder/condition-expression-result.ts:15](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/implementations/dyna-x/condition-builder/condition-expression-result.ts#L15)

Object mapping value placeholders to their typed values
