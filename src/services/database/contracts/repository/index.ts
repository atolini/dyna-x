import { IConditionBuilder } from '../condition-builder';
import { IUpdateBuilder } from '../update-builder';

/**
 * Generic repository interface for database operations
 *
 * @template T Type of the item to be managed in the database
 * @template K Type of the key used to identify items
 * @template C Type of the condition builder response (build result)
 * @template U Type of the update builder response (build result)
 */
export interface IRepository<T, K, C, U> {
  /**
   * Retrieves a single item by its key
   * @param {K} key The key of the item to retrieve
   * @returns {Promise<T | null>} The retrieved item or null if not found
   */
  getItem(key: K): Promise<T | null>;

  /**
   * Creates or replaces an item in the database
   * @param {T} item The item to store
   * @returns {Promise<T>} The stored item
   */
  putItem(item: T): Promise<T>;

  /**
   * Deletes an item from the database
   * @param {K} key The key of the item to delete
   * @returns {Promise<void>} Resolves when deletion is complete
   */
  deleteItem(key: K): Promise<void>;

  /**
   * Performs batch write operations (put and/or delete)
   * @param {T[]} putItems Array of items to put
   * @param {K[]} [deleteKeys] Optional array of keys to delete
   * @returns {Promise<Array<{ type: 'put' | 'delete', item: T | K }>>}
   *          Array of operation results indicating success/failure
   */
  batchWriteItems(
    putItems: T[],
    deleteKeys?: K[],
  ): Promise<Array<{ type: 'put' | 'delete'; item: T | K }>>;

  /**
   * Queries the database using conditions
   * @param {IConditionBuilder<C>} condition The query conditions
   * @param {string} [indexName] Optional index name to query against
   * @returns {Promise<T[] | null>} Array of matching items or null if none found
   */
  query(
    condition: IConditionBuilder<C>,
    indexName?: string,
  ): Promise<T[] | null>;

  /**
   * Updates an existing item in the database
   * @param {IUpdateBuilder<U>} update The update operations to perform
   * @param {K} key The key of the item to update
   * @param {IConditionBuilder<C>} [condition] Optional conditions for conditional update
   * @returns {Promise<T | null>} The updated item or null if update failed
   */
  update(
    update: IUpdateBuilder<U>,
    key: K,
    condition?: IConditionBuilder<C>,
  ): Promise<T | null>;
}
