import { IConditionBuilder } from '../condition-builder';
import { IUpdateBuilder } from '../update-builder';

/**
 * A generic interface for performing database operations.
 *
 * This interface outlines methods for the basic operations you would expect in a repository pattern:
 * creating, reading, updating, deleting, querying, and batch writing items. It is designed to be implemented
 * by specific repositories such as those for DynamoDB, MongoDB, or other databases.
 *
 * The interface is flexible and can work with any type of item, key, condition builder, and update builder.
 * Each method is asynchronous, returning a promise, which allows for non-blocking database operations.
 *
 * Key Features:
 * - Perform batch writes to efficiently handle bulk operations.
 * - Query the database with custom conditions and optional index names for more advanced querying.
 * - Conditionally update items based on specified conditions.
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
