import { ILogger } from '../../../../../../utils/logger/contracts';
import { ConditionBuilder } from '../../condition-builder';
import { Key } from '../../repository/interfaces/key';

/**
 * @class DynaXReadEventLogger
 * @classdesc
 * Helper class responsible for logging read-related events performed by the {@link DynaXReadRepository}.
 *
 * Logs successful item retrievals and query operations in a structured format using the provided logger instance.
 * Useful for observability, auditing, and debugging read operations on a DynamoDB table.
 *
 * @example
 * const logger = new ConsoleLogger(); // implements ILogger
 * const readLogger = new DynaXReadEventLogger(logger, 'users-table');
 * readLogger.itemFetched({ id: '123' }, { id: '123', name: 'Alice' });
 */
export class DynaXReadEventLogger<T> {
  private logger: ILogger<unknown>;
  private readonly tableName: string;

  /**
   * Creates an instance of DynaXReadEventLogger.
   *
   * @param {ILogger<any>} logger - A logger instance that implements the ILogger interface.
   * @param {string} tableName - The name of the DynamoDB table being read from.
   */
  constructor(logger: ILogger<unknown>, tableName: string) {
    this.logger = logger;
    this.tableName = tableName;
  }

  /**
   * Logs an item retrieval event.
   *
   * @param {Record<string, any>} key - The key used to retrieve the item.
   * @param {T | null} result - The item returned by DynamoDB, or null if not found.
   */
  public itemFetched(key: Record<string, any>, result: T | null): void {
    this.logger.info({
      message: result ? 'Item Retrieved' : 'Item Not Found',
      tableName: this.tableName,
      key,
      item: result,
    });
  }

  /**
   * Logs a query execution event.
   *
   * @param {ConditionBuilder} condition - The condition used in the query.
   * @param {T[]} results - The list of items returned by the query.
   * @param {Key | undefined} lastEvaluatedKey - The key used for pagination, if any.
   */
  public queryExecuted(
    conditions: Record<string, unknown>,
    results: T[],
    lastEvaluatedKey?: Key,
  ): void {
    this.logger.info({
      message: 'Query Executed',
      tableName: this.tableName,
      condition: conditions, // Assuming ConditionBuilder has a toString implementation for debugging
      itemsReturned: results.length,
      lastEvaluatedKey,
    });
  }
}
