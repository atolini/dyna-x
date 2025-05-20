/**
 * @interface IWriteRepositoryEventLogger
 * @template T - The type representing an individual item in the repository.
 * @template K - The type representing the key used to identify items.
 * @template U - The type representing the update expression or object used during updates.
 * @template C - The type representing conditions used for conditional operations.
 *
 * @description
 * Defines the contract for logging write operations in a repository context, including
 * creation, deletion, updates, and batch write events. This is useful for auditing,
 * debugging, and monitoring purposes in systems interacting with databases like DynamoDB.
 */
export interface IWriteRepositoryEventLogger<T, K, U, C> {
  /**
   * Logs an event for creating or replacing a single item in the repository.
   *
   * @param {T} item - The item that was added or replaced in the repository.
   */
  itemCreated(item: T): void;

  /**
   * Logs an event when a single item is deleted from the repository.
   *
   * @param {K} key - The key identifying the item that was deleted.
   */
  itemDeleted(key: K): void;

  /**
   * Logs an event for updating a single item in the repository.
   *
   * @param {K} key - The key identifying the item to be updated.
   * @param {U} updates - The update instructions or object.
   * @param {C} [conditions] - Optional conditions that were applied to the update operation.
   */
  itemUpdated(key: K, updates: U, conditions?: C): void;

  /**
   * Logs an event for a batch write operation involving multiple items.
   *
   * @param {T[]} putItems - The list of items that were inserted or replaced.
   * @param {K[]} deleteKeys - The list of keys identifying the items that were deleted.
   */
  batchWritePerformed(putItems: T[], deleteKeys: K[]): void;
}
