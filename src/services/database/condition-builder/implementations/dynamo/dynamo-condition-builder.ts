import { IConditionBuilder } from '@database/condition-builder/contracts/i-condition-builder';
import { DynamoConditionExpressionResult } from '@database/condition-builder/implementations/dynamo/dynamo-condition-expression-result';

/**
 * @class DynamoConditionBuilder
 * @implements {IConditionBuilder<DynamoConditionExpressionResult>}
 *
 * @classdesc
 * A utility class for building DynamoDB condition expressions dynamically.
 *
 * This class allows you to compose conditions such as equality, inequality, greater than, and less than,
 * and combine them using logical operators like AND and OR.
 *
 * It outputs a ready-to-use structure compatible with DynamoDB queries.
 *
 * @example
 * const builder = new DynamoDBConditionBuilder();
 * const condition = builder
 *   .eq('status', 'ACTIVE')
 *   .and()
 *   .gt('age', 18)
 *   .build();
 *
 * // Result:
 * // {
 * //   ConditionExpression: "#attr0 = :val0 AND #attr1 > :val1",
 * //   ExpressionAttributeNames: { "#attr0": "status", "#attr1": "age" },
 * //   ExpressionAttributeValues: { ":val0": { S: "ACTIVE" }, ":val1": { N: "18" } }
 * // }
 */
export class DynamoConditionBuilder
  implements IConditionBuilder<DynamoConditionExpressionResult>
{
  private expressions: string[] = [];
  private attributeNames: Record<string, string> = {};
  private attributeValues: Record<string, any> = {};
  private index = 0;

  /**
   * Adds an equality condition (field = value).
   *
   * @param {string} field The name of the attribute to compare
   * @param {string | number | boolean} value The expected value
   * @returns {DynamoConditionBuilder} The builder instance for chaining
   */
  eq(field: string, value: string | number | boolean): DynamoConditionBuilder {
    return this.addCondition(field, '=', value);
  }

  /**
   * Adds a not-equal condition (field <> value).
   *
   * @param {string} field The name of the attribute to compare
   * @param {string | number | boolean} value The value to compare against
   * @returns {DynamoConditionBuilder} The builder instance for chaining
   */
  ne(field: string, value: string | number | boolean): DynamoConditionBuilder {
    return this.addCondition(field, '<>', value);
  }

  /**
   * Adds a greater-than condition (field > value).
   *
   * @param {string} field The name of the attribute to compare
   * @param {string | number} value The value to compare against
   * @returns {DynamoConditionBuilder} The builder instance for chaining
   */
  gt(field: string, value: string | number): DynamoConditionBuilder {
    return this.addCondition(field, '>', value);
  }

  /**
   * Adds a less-than condition (field < value).
   *
   * @param {string} field The name of the attribute to compare
   * @param {string | number} value The value to compare against
   * @returns {DynamoConditionBuilder} The builder instance for chaining
   */
  lt(field: string, value: string | number): DynamoConditionBuilder {
    return this.addCondition(field, '<', value);
  }

  /**
   * Combines the previous conditions using the AND logical operator.
   *
   * @returns {DynamoConditionBuilder} The builder instance for chaining
   */
  and(): DynamoConditionBuilder {
    this.expressions.push('AND');
    return this;
  }

  /**
   * Combines the previous conditions using the OR logical operator.
   *
   * @returns {DynamoConditionBuilder} The builder instance for chaining
   */
  or(): DynamoConditionBuilder {
    this.expressions.push('OR');
    return this;
  }

  /**
   * Builds and returns the final condition expression object,
   * ready to be used in a DynamoDB query or update operation.
   *
   * @returns {ConditionExpressionResult} The assembled condition expression, attribute names, and attribute values
   */
  build(): DynamoConditionExpressionResult {
    return {
      ConditionExpression: this.expressions.join(' '),
      ExpressionAttributeNames: this.attributeNames,
      ExpressionAttributeValues: this.attributeValues,
    };
  }

  /**
   * Adds a generic condition with a given operator between a field and a value.
   *
   * @private
   * @param {string} field The name of the attribute
   * @param {string} operator The comparison operator (e.g., '=', '<>', '>', '<')
   * @param {any} value The value to compare against
   * @returns {DynamoConditionBuilder} The builder instance for chaining
   */
  private addCondition(
    field: string,
    operator: string,
    value: any,
  ): DynamoConditionBuilder {
    const fieldPlaceholder = `#attr${this.index}`;
    const valuePlaceholder = `:val${this.index}`;

    this.expressions.push(
      `${fieldPlaceholder} ${operator} ${valuePlaceholder}`,
    );
    this.attributeNames[fieldPlaceholder] = field;
    this.attributeValues[valuePlaceholder] = this.formatValue(value);
    this.index++;

    return this;
  }

  /**
   * Formats a value into the structure expected by DynamoDB.
   *
   * @private
   * @param {any} value The value to format
   * @returns {object} The DynamoDB-typed value
   * @throws {Error} If the value type is not supported
   */
  private formatValue(value: any): object {
    if (typeof value === 'string') return { S: value };
    if (typeof value === 'number') return { N: value.toString() };
    if (typeof value === 'boolean') return { BOOL: value };
    throw new Error(`Unsupported value type: ${typeof value}`);
  }
}
