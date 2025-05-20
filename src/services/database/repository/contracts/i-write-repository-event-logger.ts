/**
 * @interface IWriteRepositoryEventLogger
 * @description
 * Interface for logging write operations on a repository, such as create, update, delete,
 * and batch write events.
 */
// Tipo de item
// K chave
// Updates format
// C conditions format
export interface IWriteRepositoryEventLogger<T, K, U, C> {
  /**
   * Logs a single item creation or replacement event.
   * @param item - The item that was put into the table.
   */
  itemCreated(item: T): void;

  /**
   * Logs a deletion event.
   * @param key - The key of the item that was deleted.
   */
  itemDeleted(key: K): void;

  /**
   * Logs an update event.
   * @param key - The key of the item being updated.
   * @param updates - The update expression object.
   * @param conditions - (Optional) Conditions applied to the update.
   */
  itemUpdated(key: K, updates: U, conditions?: C): void;

  /**
   * Logs a batch write operation.
   * @param putItems - Items that were inserted or replaced.
   * @param deleteKeys - Keys of items that were deleted.
   * @param unprocessedItems - (Optional) Items that were not processed in the batch.
   */
  batchWritePerformed(putItems: T[], deleteKeys: K[]): void;
}
