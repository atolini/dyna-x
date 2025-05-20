import { IConditionBuilder } from '@database/condition-builder/contracts/i-condition-builder';

/**
 * @interface IReadRepository
 * @template T - The type of the item stored in the database.
 * @template K - The type of the key used to uniquely identify an item.
 * @template C - The type of the condition builder used for queries, extending IConditionBuilder<any>.
 *
 * @description
 * Defines the contract for a repository that supports read-only operations,
 * such as fetching a single item by key or querying multiple items using conditions.
 */
export interface IReadRepository<T, K, C extends IConditionBuilder<any>> {
  /**
   * Retrieves a single item by its key.
   *
   * @param key - The key used to locate the item.
   * @returns A promise resolving to the item if found, or null otherwise.
   */
  getItem(key: K): Promise<T | null>;

  /**
   * Queries items from the database based on provided conditions.
   *
   * @param condition - A condition builder instance defining the query conditions.
   * @param indexName - (Optional) The name of the secondary index to use for the query.
   * @returns A promise resolving to an object containing the matched items and,
   *          if pagination is required, the last evaluated key. Returns null if no items matched.
   */
  query(
    condition: C,
    indexName?: string,
  ): Promise<{ items: T[]; lastEvaluatedKey?: K } | null>;
}
