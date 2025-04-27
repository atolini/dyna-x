[**kernel**](../../../../../../README.md)

***

[kernel](../../../../../../modules.md) / [services/database/contracts/condition-builder/i-condition-builder](../README.md) / IConditionBuilder

# Interface: IConditionBuilder\<T\>

Defined in: [src/services/database/contracts/condition-builder/i-condition-builder.ts:5](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/contracts/condition-builder/i-condition-builder.ts#L5)

Interface for building conditional expressions

## Type Parameters

### T

`T`

Type of the result returned by the build() method

## Methods

### and()

> **and**(): `IConditionBuilder`\<`T`\>

Defined in: [src/services/database/contracts/condition-builder/i-condition-builder.ts:42](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/contracts/condition-builder/i-condition-builder.ts#L42)

Adds a logical AND operator between conditions

#### Returns

`IConditionBuilder`\<`T`\>

The ConditionBuilder instance for chaining

***

### build()

> **build**(): `T`

Defined in: [src/services/database/contracts/condition-builder/i-condition-builder.ts:54](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/contracts/condition-builder/i-condition-builder.ts#L54)

Compiles all conditions into the final expression object

#### Returns

`T`

The built condition expression object

***

### eq()

> **eq**(`field`, `value`): `IConditionBuilder`\<`T`\>

Defined in: [src/services/database/contracts/condition-builder/i-condition-builder.ts:12](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/contracts/condition-builder/i-condition-builder.ts#L12)

Adds an equality condition (field = value)

#### Parameters

##### field

`string`

Field name to compare

##### value

`any`

Value to compare against

#### Returns

`IConditionBuilder`\<`T`\>

The ConditionBuilder instance for chaining

***

### gt()

> **gt**(`field`, `value`): `IConditionBuilder`\<`T`\>

Defined in: [src/services/database/contracts/condition-builder/i-condition-builder.ts:28](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/contracts/condition-builder/i-condition-builder.ts#L28)

Adds a greater-than condition (field > value)

#### Parameters

##### field

`string`

Field name to compare

##### value

`any`

Value to compare against

#### Returns

`IConditionBuilder`\<`T`\>

The ConditionBuilder instance for chaining

***

### lt()

> **lt**(`field`, `value`): `IConditionBuilder`\<`T`\>

Defined in: [src/services/database/contracts/condition-builder/i-condition-builder.ts:36](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/contracts/condition-builder/i-condition-builder.ts#L36)

Adds a less-than condition (field < value)

#### Parameters

##### field

`string`

Field name to compare

##### value

`any`

Value to compare against

#### Returns

`IConditionBuilder`\<`T`\>

The ConditionBuilder instance for chaining

***

### ne()

> **ne**(`field`, `value`): `IConditionBuilder`\<`T`\>

Defined in: [src/services/database/contracts/condition-builder/i-condition-builder.ts:20](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/contracts/condition-builder/i-condition-builder.ts#L20)

Adds a non-equality condition (field != value)

#### Parameters

##### field

`string`

Field name to compare

##### value

`any`

Value to compare against

#### Returns

`IConditionBuilder`\<`T`\>

The ConditionBuilder instance for chaining

***

### or()

> **or**(): `IConditionBuilder`\<`T`\>

Defined in: [src/services/database/contracts/condition-builder/i-condition-builder.ts:48](https://github.com/atolini/dyna-x/blob/9212a96a81963b1f87ab4e0a5690bd13f536ed17/src/services/database/contracts/condition-builder/i-condition-builder.ts#L48)

Adds a logical OR operator between conditions

#### Returns

`IConditionBuilder`\<`T`\>

The ConditionBuilder instance for chaining
