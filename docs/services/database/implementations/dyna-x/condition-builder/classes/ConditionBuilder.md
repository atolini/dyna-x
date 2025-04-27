[**kernel**](../../../../../../README.md)

***

[kernel](../../../../../../modules.md) / [services/database/implementations/dyna-x/condition-builder](../README.md) / ConditionBuilder

# Class: ConditionBuilder

Defined in: [src/services/database/implementations/dyna-x/condition-builder/index.ts:4](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/implementations/dyna-x/condition-builder/index.ts#L4)

Interface for building conditional expressions

## Implements

- [`IConditionBuilder`](../../../../contracts/condition-builder/i-condition-builder/interfaces/IConditionBuilder.md)\<[`ConditionExpressionResult`](../condition-expression-result/type-aliases/ConditionExpressionResult.md)\>

## Constructors

### Constructor

> **new ConditionBuilder**(): `ConditionBuilder`

#### Returns

`ConditionBuilder`

## Methods

### and()

> **and**(): `ConditionBuilder`

Defined in: [src/services/database/implementations/dyna-x/condition-builder/index.ts:45](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/implementations/dyna-x/condition-builder/index.ts#L45)

Adiciona uma condição composta com AND

#### Returns

`ConditionBuilder`

#### Implementation of

[`IConditionBuilder`](../../../../contracts/condition-builder/i-condition-builder/interfaces/IConditionBuilder.md).[`and`](../../../../contracts/condition-builder/i-condition-builder/interfaces/IConditionBuilder.md#and)

***

### build()

> **build**(): `object`

Defined in: [src/services/database/implementations/dyna-x/condition-builder/index.ts:61](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/implementations/dyna-x/condition-builder/index.ts#L61)

Retorna os valores prontos para uso na query

#### Returns

`object`

##### ConditionExpression

> **ConditionExpression**: `string`

##### ExpressionAttributeNames

> **ExpressionAttributeNames**: `Record`\<`string`, `string`\>

##### ExpressionAttributeValues

> **ExpressionAttributeValues**: `Record`\<`string`, `any`\>

#### Implementation of

[`IConditionBuilder`](../../../../contracts/condition-builder/i-condition-builder/interfaces/IConditionBuilder.md).[`build`](../../../../contracts/condition-builder/i-condition-builder/interfaces/IConditionBuilder.md#build)

***

### eq()

> **eq**(`field`, `value`): `ConditionBuilder`

Defined in: [src/services/database/implementations/dyna-x/condition-builder/index.ts:17](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/implementations/dyna-x/condition-builder/index.ts#L17)

Adiciona uma condição de igualdade

#### Parameters

##### field

`string`

Nome do atributo

##### value

`any`

Valor esperado

#### Returns

`ConditionBuilder`

#### Implementation of

[`IConditionBuilder`](../../../../contracts/condition-builder/i-condition-builder/interfaces/IConditionBuilder.md).[`eq`](../../../../contracts/condition-builder/i-condition-builder/interfaces/IConditionBuilder.md#eq)

***

### gt()

> **gt**(`field`, `value`): `ConditionBuilder`

Defined in: [src/services/database/implementations/dyna-x/condition-builder/index.ts:31](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/implementations/dyna-x/condition-builder/index.ts#L31)

Adiciona uma condição de maior que (>)

#### Parameters

##### field

`string`

##### value

`any`

#### Returns

`ConditionBuilder`

#### Implementation of

[`IConditionBuilder`](../../../../contracts/condition-builder/i-condition-builder/interfaces/IConditionBuilder.md).[`gt`](../../../../contracts/condition-builder/i-condition-builder/interfaces/IConditionBuilder.md#gt)

***

### lt()

> **lt**(`field`, `value`): `ConditionBuilder`

Defined in: [src/services/database/implementations/dyna-x/condition-builder/index.ts:38](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/implementations/dyna-x/condition-builder/index.ts#L38)

Adiciona uma condição de menor que (<)

#### Parameters

##### field

`string`

##### value

`any`

#### Returns

`ConditionBuilder`

#### Implementation of

[`IConditionBuilder`](../../../../contracts/condition-builder/i-condition-builder/interfaces/IConditionBuilder.md).[`lt`](../../../../contracts/condition-builder/i-condition-builder/interfaces/IConditionBuilder.md#lt)

***

### ne()

> **ne**(`field`, `value`): `ConditionBuilder`

Defined in: [src/services/database/implementations/dyna-x/condition-builder/index.ts:24](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/implementations/dyna-x/condition-builder/index.ts#L24)

Adiciona uma condição de diferente (!=)

#### Parameters

##### field

`string`

##### value

`any`

#### Returns

`ConditionBuilder`

#### Implementation of

[`IConditionBuilder`](../../../../contracts/condition-builder/i-condition-builder/interfaces/IConditionBuilder.md).[`ne`](../../../../contracts/condition-builder/i-condition-builder/interfaces/IConditionBuilder.md#ne)

***

### or()

> **or**(): `ConditionBuilder`

Defined in: [src/services/database/implementations/dyna-x/condition-builder/index.ts:53](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/implementations/dyna-x/condition-builder/index.ts#L53)

Adiciona uma condição composta com OR

#### Returns

`ConditionBuilder`

#### Implementation of

[`IConditionBuilder`](../../../../contracts/condition-builder/i-condition-builder/interfaces/IConditionBuilder.md).[`or`](../../../../contracts/condition-builder/i-condition-builder/interfaces/IConditionBuilder.md#or)
