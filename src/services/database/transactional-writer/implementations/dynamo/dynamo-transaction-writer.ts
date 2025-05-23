import {
  DynamoDBClient,
  TransactWriteItem,
  TransactWriteItemsCommand,
  TransactWriteItemsInput,
} from '@aws-sdk/client-dynamodb';
import { ITransactionalWriter } from '@database/transactional-writer/contracts/i-transactional-writer';
import { v4 as uuidv4 } from 'uuid';
import { ITransactionalWriterUnit } from '@database/transactional-writer/contracts/i-transactional-writer-unit';
import { MaxItemsExceededError } from '@database/transactional-writer/implementations/dynamo/max-item-exceeded-error';
import { DynamoSchema } from '@database/schema/implementations/dynamo/dynamo-schema';
import { DynamoItem } from '@database/transactional-writer/implementations/dynamo/dynamo-item';

/**
 * @implements {ITransactionalWriter<DynamoSchema<any>, DynamoItem>}
 *
 * @description
 * Provides a transactional writer implementation for DynamoDB using AWS SDK.
 * It handles writing multiple items in a single atomic transaction and performs
 * validation on batch size and item keys.
 */
export class DynamoTransactionWriter
  implements ITransactionalWriter<DynamoSchema<any>, DynamoItem>
{
  private readonly client: DynamoDBClient;
  private readonly maxBatchItems: number = 100; // DynamoDB limit for batch write operations

  /**
   * Creates a new instance of DynamoTransactionWrite.
   *
   * @param {string} [region] - Optional AWS region. If not provided, uses default SDK configuration.
   */
  constructor(region?: string) {
    this.client = new DynamoDBClient(region ? { region: region } : {});
  }

  /**
   * Writes a batch of items to DynamoDB transactionally.
   * Validates the batch size and item keys before sending the transaction.
   *
   * @param {ITransactionalWriterUnit<DynamoSchema<any>, DynamoItem>[]} units -
   * An array of transactional write units, each containing a schema container and an item to be written.
   *
   * @returns {Promise<void>} - A promise that resolves when the transaction is completed.
   *
   * @throws {MaxItemsExceededError} - If the number of items exceeds DynamoDB's transactional limit.
   */
  async write(
    units: ITransactionalWriterUnit<DynamoSchema<any>, DynamoItem>[],
  ): Promise<void> {
    this.validateBatchSize(units);
    this.validateKeys(units);

    const transacts = units.map((unit) => ({
      Put: {
        TableName: unit.container.getTableName(),
        Item: unit.item,
      } as TransactWriteItem,
    })) as TransactWriteItem[];

    const params: TransactWriteItemsInput = {
      TransactItems: transacts,
      ClientRequestToken: uuidv4(),
    };

    const command = new TransactWriteItemsCommand(params);

    await this.client.send(command);
  }

  /**
   * Validates that each item in the batch conforms to the key schema
   * defined in its container.
   *
   * @private
   * @param {ITransactionalWriterUnit<DynamoSchema<any>, DynamoItem>[]} units -
   * The units whose item keys will be validated.
   */
  private validateKeys(
    units: ITransactionalWriterUnit<DynamoSchema<any>, DynamoItem>[],
  ) {
    for (const unit of units) {
      unit.container.validateKey(unit.item);
    }
  }

  /**
   * Validates that the number of items in the batch does not exceed
   * DynamoDB's transactional write limit.
   *
   * @private
   * @param {any[]} units - The list of units to be written.
   *
   * @throws {MaxItemsExceededError} - If the number of units exceeds the allowed limit.
   */
  private validateBatchSize(units: any[]): void {
    if (units.length > this.maxBatchItems) {
      throw new MaxItemsExceededError(this.maxBatchItems);
    }
  }
}
