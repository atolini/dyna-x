/**
 * Thrown when the number of transactional write items exceeds the allowed DynamoDB limit.
 *
 * DynamoDB supports a maximum of 100 items in a single `TransactWriteItems` operation.
 */
export class MaxItemsExceededError extends Error {
  public readonly name = 'MaxItemsExceededError';

  /**
   * @param {number} maxItems - The maximum number of allowed items.
   */
  constructor(maxItems: number) {
    super(
      `Transaction batch exceeds the maximum allowed limit of ${maxItems} items.`,
    );
  }
}
