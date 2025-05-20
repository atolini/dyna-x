import { IConditionBuilder } from '../../condition-builder/contracts/i-condition-builder';

/**
 * @interface IReadRepository
 * @template T Type of the item to be read
 * @template K Type of the key used to identify items
 * @template C Type of the condition builder response (build result)
 *
 * @description
 * Interface for read-only database operations.
 * Provides methods to retrieve and query items from a database.
 */
export interface IReadRepository<T, K, C> {
  /**
   * Retrieves a single item by its key.
   * @param {K} key The key of the item to retrieve.
   * @returns {Promise<T | null>} The retrieved item or null if not found.
   */
  getItem(key: K): Promise<T | null>;

  /**
   * Queries the database using conditions.
   * @param {IConditionBuilder<C>} condition The query conditions.
   * @param {string} [indexName] Optional index name to query against.
   * @returns {Promise<T[] | null>} Array of matching items or null if none found.
   */
  query(
    condition: IConditionBuilder<C>,
    indexName?: string,
  ): Promise<{ items: T[]; lastEvaluatedKey?: K } | null>;
}
