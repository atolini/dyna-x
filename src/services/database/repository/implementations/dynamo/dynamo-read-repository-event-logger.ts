import { ILogger } from '@logger/contracts';
import { DynamoConditionExpressionResult } from '@database/condition-builder/implementations/dynamo';
import { IReadRepositoryEventLogger } from '@database/repository/contracts';
import { Key } from '@database/repository/implementations/dynamo';

/**
 * Helper class responsible for logging read-related events performed by the {@link DynamoReadRepository}.
 *
 * Logs successful item retrievals and query operations in a structured format using the provided logger instance.
 * Useful for observability, auditing, and debugging read operations on a DynamoDB table.
 *
 * @example
 * const logger = new ConsoleLogger(); // implements ILogger
 * const readLogger = new DynamoReadRepositoryEventLogger(logger, 'users-table');
 * readLogger.itemFetched({ id: '123' }, { id: '123', name: 'Alice' });
 */
export class DynamoReadRepositoryEventLogger<T>
  implements IReadRepositoryEventLogger<T, Key, DynamoConditionExpressionResult>
{
  private readonly logger: ILogger<unknown>;
  private readonly tableName: string;

  /**
   * Creates an instance of DynamoReadRepositoryEventLogger.
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
   * @param {Key} key - The key used to retrieve the item.
   * @param {T | null} result - The item returned by DynamoDB, or null if not found.
   */
  public itemFetched(key: Key, result: T | null): void {
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
   * @param {DynamoConditionExpressionResult} conditions - The condition used in the query.
   * @param {T[]} results - The list of items returned by the query.
   * @param {Key | undefined} lastEvaluatedKey - The key used for pagination, if any.
   */
  public queryExecuted(
    conditions: DynamoConditionExpressionResult,
    results: T[],
    lastEvaluatedKey?: Key,
  ): void {
    this.logger.info({
      message: 'Query Executed',
      tableName: this.tableName,
      condition: conditions,
      itemsReturned: results.length,
      lastEvaluatedKey,
    });
  }
}
