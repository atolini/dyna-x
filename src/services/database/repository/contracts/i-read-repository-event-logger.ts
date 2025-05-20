/**
 * @interface IReadRepositoryEventLogger
 * @template T - The type of the item being read from the repository.
 * @template K - The type representing the key used to fetch an item.
 * @template C - The type representing the built query conditions (e.g., from a condition builder).
 *
 * @description
 * Defines the contract for logging read-related events in a repository context,
 * such as fetching individual items or executing queries. Useful for auditing, debugging,
 * or monitoring read operations.
 */
export interface IReadRepositoryEventLogger<T, K, C> {
  /**
   * Logs an event when an item is fetched by key.
   *
   * @param {K} key - The key used to retrieve the item.
   * @param {T | null} result - The item returned by the repository, or null if not found.
   */
  itemFetched(key: K, result: T | null): void;

  /**
   * Logs an event when a query is executed.
   *
   * @param {C} conditions - The query conditions used to perform the search.
   * @param {T[]} results - The list of items returned by the query.
   */
  queryExecuted(conditions: C, results: T[]): void;
}
