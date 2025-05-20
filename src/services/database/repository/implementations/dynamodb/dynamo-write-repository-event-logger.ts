import { ILogger } from '../../../../logger/contracts';
import { DynamoConditionExpressionResult } from '../../../condition-builder/implementations/dynamo/dynamo-condition-expression-result';
import { DynamoUpdateExpressionResult } from '../../../update-builder/implementations/dynamo/dynamo-update-expression-result';
import { IWriteRepositoryEventLogger } from '../../contracts/i-write-repository-event-logger';
import { Key } from './key';

/**
 * @class DynamoWriteRepositoryEventLogger
 * @classdesc
 * Logs structured events related to write operations on a DynamoDB table using DynaXWriteRepository.
 *
 * This logger captures `putItem`, `update`, `deleteItem`, and `batchWriteItems` operations
 * for observability, audit trails, and debugging.
 *
 * @example
 * const logger = new Logger<Context>({...}); // implements ILogger
 * const eventLogger = new DynamoWriteRepositoryEventLogger(logger, 'HiringRequestTable');
 * eventLogger.itemCreated({ id: '123', name: 'Test' });
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
  private logger: ILogger<unknown>;
  private readonly tableName: string;

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
