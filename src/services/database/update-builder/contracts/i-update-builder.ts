/**
 * @template T - Type of the result returned by the build() method.
 *
 * Interface for building update expressions for database operations.
 * This interface allows for the construction of complex update expressions.
 * It provides methods for setting values, removing fields, and incrementing numeric values.
 */
export interface IUpdateBuilder<T> {
  /**
   * Sets a value for a field (SET operation)
   * @param {string} field Name of the field to update
   * @param {any} value New value for the field
   * @returns {IUpdateBuilder<T>} The UpdateBuilder instance for method chaining
   */
  set(field: string, value: any): IUpdateBuilder<T>;

  /**
   * Removes a field (REMOVE operation)
   * @param {string} field Name of the field to remove
   * @returns {IUpdateBuilder<T>} The UpdateBuilder instance for method chaining
   */
  remove(field: string): IUpdateBuilder<T>;

  /**
   * Increments a numeric value (ADD operation)
   * @param {string} field Name of the numeric field
   * @param {number} value Value to be added
   * @returns {IUpdateBuilder<T>} The UpdateBuilder instance for method chaining
   */
  add(field: string, value: number): IUpdateBuilder<T>;

  /**
   * Builds the update expression for database
   * @returns {T} Object with formatted expressions
   */
  build(): T;
}
