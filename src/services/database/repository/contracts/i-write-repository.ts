import { IConditionBuilder } from '@database/condition-builder/contracts/i-condition-builder';
import { IUpdateBuilder } from '@database/update-builder/contracts/i-update-builder';

/**
 * @interface IWriteRepository
 * @template T - Type of the item to be written.
 * @template K - Type of the key used to identify items.
 * @template C - Type of the condition builder used for conditional operations.
 * @template U - Type of the update builder used for update operations.
 *
 * @description
 * Interface for write operations in a database.
 * Supports inserting, updating, deleting, and performing batch writes of items.
 */
export interface IWriteRepository<
  T,
  K,
  C extends IConditionBuilder<any>,
  U extends IUpdateBuilder<any>,
> {
  /**
   * Creates or replaces an item in the database.
   *
   * @param item - The item to store.
   * @returns A promise resolving to the stored item.
   */
  putItem(item: T): Promise<T>;

  /**
   * Deletes an item from the database by key.
   *
   * @param key - The key of the item to delete.
   * @returns A promise that resolves when the item is deleted.
   */
  deleteItem(key: K): Promise<void>;

  /**
   * Performs batch write operations including put and/or delete.
   *
   * @param putItems - Array of items to insert or replace.
   * @param deleteKeys - Optional array of keys representing items to delete.
   * @returns A promise resolving to an array of result objects indicating the type and item of each operation.
   */
  batchWriteItems?(
    putItems: T[],
    deleteKeys?: K[],
  ): Promise<Array<{ type: 'put' | 'delete'; item: T | K }>>;

  /**
   * Updates an existing item in the database.
   *
   * @param update - The update builder containing the update expression.
   * @param key - The key of the item to update.
   * @param condition - Optional condition builder that must evaluate to true for the update to proceed.
   * @returns A promise resolving to the updated item, or null if the update was not applied.
   */
  update(update: U, key: K, condition?: C): Promise<T | null>;
}
