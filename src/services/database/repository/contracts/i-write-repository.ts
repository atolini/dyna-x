import { IConditionBuilder } from '@database/condition-builder/contracts/i-condition-builder';
import { IUpdateBuilder } from '@database/update-builder/contracts/i-update-builder';

/**
 * @interface IWriteRepository
 * @template T Type of the item to be written
 * @template K Type of the key used to identify items
 * @template C Type of the condition builder response (build result)
 * @template U Type of the update builder response (build result)
 *
 * @description
 * Interface for write-related database operations.
 * Provides methods to insert, update, delete, and batch write items to a database.
 */
export interface IWriteRepository<T, K, C, U> {
  /**
   * Creates or replaces an item in the database.
   * @param {T} item The item to store.
   * @returns {Promise<T>} The stored item.
   */
  putItem(item: T): Promise<T>;

  /**
   * Deletes an item from the database.
   * @param {K} key The key of the item to delete.
   * @returns {Promise<void>} Resolves when deletion is complete.
   */
  deleteItem(key: K): Promise<void>;

  /**
   * Performs batch write operations (put and/or delete).
   * @param {T[]} putItems Array of items to put.
   * @param {K[]} [deleteKeys] Optional array of keys to delete.
   * @returns {Promise<Array<{ type: 'put' | 'delete', item: T | K }>>}
   *          Array of operation results indicating success/failure.
   */
  batchWriteItems?(
    putItems: T[],
    deleteKeys?: K[],
  ): Promise<Array<{ type: 'put' | 'delete'; item: T | K }>>;

  /**
   * Updates an existing item in the database.
   * @param {IUpdateBuilder<U>} update The update operations to perform.
   * @param {K} key The key of the item to update.
   * @param {IConditionBuilder<C>} [condition] Optional conditions for conditional update.
   * @returns {Promise<T | null>} The updated item or null if update failed.
   */
  update(
    update: IUpdateBuilder<U>,
    key: K,
    condition?: IConditionBuilder<C>,
  ): Promise<T | null>;
}
