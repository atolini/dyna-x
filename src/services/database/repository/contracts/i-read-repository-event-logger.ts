/**
 * @interface IReadRepositoryEventLogger
 * @description
 * Interface that defines the contract for logging read-related events in a DynamoDB context.
 */
// C resultado da construção do conditionbuilder
export interface IReadRepositoryEventLogger<T, K, C> {
  /**
   * Logs an item retrieval event.
   *
   * @param {Record<string, any>} key - The key used to retrieve the item.
   * @param {T | null} result - The item returned by DynamoDB, or null if not found.
   */
  itemFetched(key: K, result: T | null): void;

  /**
   * Logs a query execution event.
   *
   * @param {Record<string, unknown>} conditions - The condition used in the query.
   * @param {T[]} results - The list of items returned by the query.
   */
  queryExecuted(conditions: C, results: T[]): void;
}
