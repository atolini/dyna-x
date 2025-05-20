import {
  DynamoDBClient,
  TransactWriteItem,
  TransactWriteItemsCommand,
  TransactWriteItemsInput,
} from '@aws-sdk/client-dynamodb';
import { ILogger } from '../../../../../utils/logger/contracts';
import { ITransactionalWriter } from '../../contracts/i-transactional-writer';
import { MaxItemsExceededError } from '../../../repository/implementations/dynamodb/helpers/max-item-exceeded-error';
import { v4 as uuidv4 } from 'uuid';
import { TransactionalWriteUnit } from '../../contracts/transactional-write-unit';

/**
 * @class DynamoDBTransactionWrite
 * @implements {ITransactionalWriter<DynaXSchema, Record<string, unknown>>}
 *
 * @classdesc
 * Provides support for transactional write operations in DynamoDB using batched requests.
 *
 * This class enables writing multiple items across different DynamoDB tables in a single atomic transaction.
 * It supports up to 100 write operations per transaction, all of which must target tables within the same AWS account and region.
 *
 * The transaction is executed atomically: either all operations succeed or none are applied.
 *
 * This implementation is particularly useful for writing Domain-Driven Design (DDD) aggregates to multiple tables (e.g., Orders, Products, etc.)
 * in a consistent and reliable manner.
 */
export class DynamoDBTransactionWrite
  implements ITransactionalWriter<DynaXSchema, Record<string, unknown>>
{
  private client: DynamoDBClient;
  private logger: ILogger<any>;
  private maxBatchItems: number;

  /**
   * Initializes the repository with a schema and a DynamoDB client.
   *
   * @param {ILogger<any>} logger - (Optional) The logger instance.
   * @param {string} [region] - (Optional) AWS region to configure the DynamoDB client.
   */
  constructor(logger?: ILogger<any>, region?: string) {
    this.client = new DynamoDBClient(region ? { region: region } : {});
    this.logger = logger;
    this.maxBatchItems = 100; // DynamoDB limit for batch write operations
  }

  /**
   * Persists a batch of items into their respective DynamoDB tables using a transactional write.
   *
   * This method performs a transactional write operation using the AWS SDK for DynamoDB.
   * It ensures that all items are written atomically — either all operations succeed or none are applied.
   *
   * Each `TransactionalWriteUnit` must contain:
   * - A `schema` that provides the target DynamoDB table name via `getTableName()`.
   * - An `item` representing the data to be written.
   *
   * Validations:
   * - The number of items must not exceed 100, or a `MaxItemsExceededError` will be thrown.
   * - Each item's key must be validated by the associated schema, or a `InvalidKeyError` may be thrown.
   *
   * @param {TransactionalWriteUnit<DynaXSchema, Record<string, unknown>>[]} units - An array of write units, each containing a schema-aware container and the item to persist.
   * @returns {Promise<void>} A promise that resolves when the transaction is successfully completed.
   *
   * @example
   * const units = [
   *   { container: userSchema, item: { id: '123', name: 'Alice' } },
   *   { container: orderSchema, item: { id: 'abc', amount: 50 } },
   * ];
   * await transactionWriter.write(units);
   *
   * @throws {MaxItemsExceededError} If the number of items exceeds the maximum allowed batch size.
   * @throws {InvalidKeyError} If one or more items have invalid keys according to the schema.
   * @throws {IdempotentParameterMismatchException} If a request is retried with the same client token but different parameters within the 10-minute idempotency window.
   * @throws {ProvisionedThroughputExceededException} If the request rate is too high.
   * @throws {RequestLimitExceeded} If throughput limits are exceeded.
   * @throws {ResourceNotFoundException} If the specified table or index does not exist.
   * @throws {TransactionCanceledException} If the transaction is canceled due to a condition check failure or other reasons.
   * @throws {TransactionInProgressException} If a transaction is already in progress.
   *
   * This method uses the AWS SDK command:
   * - {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/TransactWriteItemsCommand/ | TransactWriteItemsCommand}
   */
  async write(
    units: TransactionalWriteUnit<DynaXSchema, Record<string, unknown>>[],
  ): Promise<void> {
    this.validateBatchSize(units);
    this.validateKeys(units);

    const transacts = units.map((unit) => ({
      Put: {
        TableName: unit.container.getTableName(), // container is assumed to be a table name
        Item: unit.item,
      } as TransactWriteItem,
    })) as TransactWriteItem[];

    const params: TransactWriteItemsInput = {
      TransactItems: transacts,
      ClientRequestToken: uuidv4(), // Unique token for idempotency
    };

    // Log the transaction details
    this.logger?.info({
      message: 'Starting DynamoDB transaction write',
      unitsCount: units.length,
      clientToken: params.ClientRequestToken,
    });

    const command = new TransactWriteItemsCommand(params);

    await this.client.send(command);

    // Log the successful transaction
    this.logger?.info('DynamoDB transaction completed successfully');

    return;
  }

  /**
   * Validates the keys of all items in the write operation against the schema.
   *
   * For each write unit, this method verifies whether the item's key matches the expected structure
   * defined in the schema. If any key is invalid, an error is thrown.
   *
   * @param units - Array of TransactionalWriteUnit objects to be validated.
   * @throws {InvalidKeyError} If any item has an invalid key.
   */
  private validateKeys(
    units: TransactionalWriteUnit<DynaXSchema, Record<string, unknown>>[],
  ) {
    for (const unit of units) {
      unit.container.validateKey(unit.item);
    }

    this.logger?.info('All item keys validated successfully');
  }

  /**
   * Validates the number of items in the write operation.
   *
   * Ensures that the batch does not exceed the maximum allowed number of write units.
   * If it does, an error is thrown to prevent invalid DynamoDB transactions.
   *
   * @param units - Array of TransactionalWriteUnit objects to be validated.
   * @throws {MaxItemsExceededError} If the batch size exceeds the configured limit.
   */
  private validateBatchSize(units: any[]): void {
    if (units.length > this.maxBatchItems) {
      throw new MaxItemsExceededError(this.maxBatchItems);
    }
  }
}
