/**
 * @interface IConditionBuilder
 * @template T - Type of the result returned by the build() method
 *
 * @description
 * Interface for building conditional expressions for database operations.
 * This interface allows for the construction of complex conditional expressions.
 * It provides methods for adding equality, non-equality, greater-than, and less-than conditions,
 * as well as logical operators like AND and OR.
 */
export interface IConditionBuilder<T> {
  /**
   * Adds an equality condition (field = value)
   * @param {string} field Field name to compare
   * @param {unknown} value Value to compare against
   * @returns {IConditionBuilder<T>} The ConditionBuilder instance for chaining
   */
  eq(field: string, value: unknown): IConditionBuilder<T>;

  /**
   * Adds a non-equality condition (field != value)
   * @param {string} field Field name to compare
   * @param {unknown} value Value to compare against
   * @returns {IConditionBuilder<T>} The ConditionBuilder instance for chaining
   */
  ne(field: string, value: unknown): IConditionBuilder<T>;

  /**
   * Adds a greater-than condition (field > value)
   * @param {string} field Field name to compare
   * @param {unknown} value Value to compare against
   * @returns {IConditionBuilder<T>} The ConditionBuilder instance for chaining
   */
  gt(field: string, value: unknown): IConditionBuilder<T>;

  /**
   * Adds a less-than condition (field < value)
   * @param {string} field Field name to compare
   * @param {unknown} value Value to compare against
   * @returns {IConditionBuilder<T>} The ConditionBuilder instance for chaining
   */
  lt(field: string, value: unknown): IConditionBuilder<T>;

  /**
   * Adds a logical AND operator between conditions
   * @returns {IConditionBuilder<T>} The ConditionBuilder instance for chaining
   */
  and(): IConditionBuilder<T>;

  /**
   * Adds a logical OR operator between conditions
   * @returns {IConditionBuilder<T>} The ConditionBuilder instance for chaining
   */
  or(): IConditionBuilder<T>;

  /**
   * Compiles all conditions into the final expression object
   * @returns {T} The built condition expression object
   */
  build(): T;
}
