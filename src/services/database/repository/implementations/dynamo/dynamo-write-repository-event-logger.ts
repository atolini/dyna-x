import { DynamoConditionExpressionResult } from '@database/condition-builder/implementations/dynamo';
import { IWriteRepositoryEventLogger } from '@database/repository/contracts';
import { Key } from '@database/repository/implementations/dynamo';
import { DynamoUpdateExpressionResult } from '@database/update-builder/implementations/dynamo';
import { ILogger } from '@logger/contracts';

/**
 * Logs structured events related to write operations on a DynamoDB table using DynamoWriteRepository.
 *
 * This logger captures `putItem`, `update`, `deleteItem`, and `batchWriteItems` operations
 * for observability, audit trails, and debugging.
 *
 * @example
 * const logger = new Logger<Context>({...}); // implements ILogger
 * const eventLogger = new DynamoWriteRepositoryEventLogger(logger, 'HiringRequestTable');
 * eventLogger.itemCreated({ id: '123', name: 'Test' });
 * eventLogger.itemDeleted({ id: '123' });
 * eventLogger.itemUpdated({ id: '123' }, updateExpression, conditions);
 * eventLogger.batchWritePerformed([{ id: '1' }], [{ id: '2' }], [{ type: 'put', item: { id: '1' } }]);
 */
export class DynamoWriteRepositoryEventLogger<T>
  implements
    IWriteRepositoryEventLogger<
      T,
      Key,
      DynamoUpdateExpressionResult,
      DynamoConditionExpressionResult
    >
{
  private readonly logger: ILogger<unknown>;
  private readonly tableName: string;

  /**
   * Creates an instance of DynamoWriteRepositoryEventLogger.
   *
   * @param logger - A logger instance that implements the ILogger interface.
   * @param tableName - The name of the DynamoDB table being written to.
   */
  constructor(logger: ILogger<unknown>, tableName: string) {
    this.logger = logger;
    this.tableName = tableName;
  }

  /**
   * Logs a single item creation or replacement event.
   * @param item - The item that was put into the table.
   */
  public itemCreated(item: T) {
    this.logger.info({
      message: 'Item Created or Replaced',
      tableName: this.tableName,
      item,
    });
  }

  /**
   * Logs a deletion event.
   * @param key - The key of the item that was deleted.
   */
  public itemDeleted(key: Key) {
    this.logger.info({
      message: 'Item Deleted',
      tableName: this.tableName,
      key,
    });
  }

  /**
   * Logs an update event.
   * @param key - The key of the item being updated.
   * @param updates - The update expression object.
   * @param conditions - (Optional) Conditions applied to the update.
   */
  public itemUpdated(
    key: Key,
    updates: DynamoUpdateExpressionResult,
    conditions?: Record<string, unknown>,
  ) {
    this.logger.info({
      message: 'Item Updated',
      tableName: this.tableName,
      key,
      updates,
      conditions,
    });
  }

  /**
   * Logs a batch write operation.
   * @param putItems - Items that were inserted or replaced.
   * @param deleteKeys - Keys of items that were deleted.
   * @param unprocessedItems - (Optional) Items that were not processed in the batch.
   */
  public batchWritePerformed(
    putItems: T[],
    deleteKeys: Key[],
    unprocessedItems?: Array<{ type: 'put' | 'delete'; item: T | Key }>,
  ) {
    this.logger.info({
      message: 'Batch Write Operation',
      tableName: this.tableName,
      putItems,
      deleteKeys,
      unprocessedItems: unprocessedItems ?? [],
    });
  }
}
