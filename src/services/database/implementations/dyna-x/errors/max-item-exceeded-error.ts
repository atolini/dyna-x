/**
 * Custom error class indicating that a DynamoDB batch operation exceeded the maximum allowed items.
 *
 * @class MaxItemsExceededError
 * @extends Error
 *
 * @example
 * // Throwing the error
 * throw new MaxItemsExceededError(25);
 *
 * @example
 * // Catching the error
 * try {
 *   // batch operation that might exceed limits
 * } catch (error) {
 *   if (error instanceof MaxItemsExceededError) {
 *     console.error(`Batch limit exceeded: ${error.message}`);
 *   }
 * }
 */
export class MaxItemsExceededError extends Error {
  /**
   * Creates a new MaxItemsExceededError instance.
   * @param {number} limit - The maximum number of items allowed in the operation
   */
  constructor(limit: number) {
    super(`Max limit reached (${limit} items)`);
    this.name = 'MaxItemsExceededError';
  }
}
