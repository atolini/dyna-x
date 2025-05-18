import {
  DeleteItemCommand,
  DeleteItemCommandInput,
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
  PutItemCommandOutput,
  UpdateItemCommand,
  UpdateItemCommandInput,
  UpdateItemCommandOutput,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { merge } from 'lodash';
import { IWriteRepository } from '../../../contracts/repository';
import {
  ConditionBuilder,
  ConditionExpressionResult,
} from '../condition-builder';
import { MaxItemsExceededError } from '../errors/max-item-exceeded-error';
import { DynaXSchema } from '../schema';
import { UpdateBuilder, UpdateExpressionResult } from '../update-builder';
import { BatchWriteHelper } from './helpers/batch-write-helper';
import { Key } from './interfaces/key';
import { UnprocessedItems } from './interfaces/unprocessed-items';
import { ILogger } from '../../../../../utils/logger/contracts';
import { DynaXWriteEventLogger } from './helpers/dyna-x-write-event-logger';

/**
 * @class DynaXRepository
 * @implements {IWriteRepository<T, Key, ConditionExpressionResult, UpdateExpressionResult>}
 * @template T - The type representing the structure of the items stored in the DynamoDB table.
 *
 * @classdesc
 * Generic repository interface for interacting with DynamoDB tables using a defined schema.
 * Defines methods for retrieving, inserting, updating, and deleting items,
 * as well as supporting batch operations and conditional updates.
 */
export class DynaXWriteRepository<T>
  implements
    IWriteRepository<T, Key, ConditionExpressionResult, UpdateExpressionResult>
{
  private schema: DynaXSchema;
  private client: DynamoDBClient;
  private maxBatchItems: number;
  private eventsLogger: DynaXWriteEventLogger;

  /**
   * Initializes the repository with a schema and a DynamoDB client.
   *
   * @param {DynaXSchema} schema - The schema defining the table structure.
   * @param {string} [region] - (Optional) AWS region to configure the DynamoDB client.
   * @param {number} [maxBatchItems=1000] - (Optional) The maximum number of items allowed in one batch write.
   */
  constructor(
    schema: DynaXSchema,
    logger: ILogger<unknown>,
    region?: string,
    maxBatchItems: number = 1000,
  ) {
    this.schema = schema;
    this.client = new DynamoDBClient(region ? { region: region } : {});
    this.maxBatchItems = maxBatchItems;
    this.eventsLogger = new DynaXWriteEventLogger(logger, this.schema.getTableName());
  }

  /**
   * Inserts or updates an item in the DynamoDB table.
   *
   * @param {T} item - The item to be inserted or updated.
   * @returns {Promise<T>} The inserted or updated item.
   *
   * @example
   * const savedItem = await repository.putItem({ id: '123', name: 'Test' });
   *
   * @throws {InternalServerError} If there is an internal error in the AWS DynamoDB service.
   * @throws {ProvisionedThroughputExceededException} If the request exceeds the provisioned throughput for the table.
   * @throws {ItemCollectionSizeLimitExceededException} If the item collection size limit is exceeded (for local secondary indexes).
   * @throws {RequestLimitExceeded} If the request limit for the account is exceeded.
   * @throws {ResourceNotFoundException} If the specified resource (table or index) does not exist.
   * @throws {TransactionConflictException} If there is a conflict with a transaction.
   * @throws {ConditionalCheckFailedException} If the condition specified in the operation is not met.
   *
   * This function uses the AWS SDK commands:
   * - {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/PutItemCommand/ | PutItemCommand}
   */
  async putItem(item: T): Promise<T> {
    this.schema.validateKey(item as Record<string, unknown>);

    const params: PutItemCommandInput = {
      TableName: this.schema.getTableName(),
      Item: item as unknown as Record<string, any>,
    };

    const command: PutItemCommand = new PutItemCommand(params);

    const response: PutItemCommandOutput = await this.client.send(command);

    const itemCreated = unmarshall(response.Attributes!) as unknown as T

    this.eventsLogger.itemCreated(itemCreated);

    return itemCreated;
  }

  /**
   * Deletes an item from the DynamoDB table based on the primary key.
   *
   * @param {Record<string, any>} key - The key identifying the item to delete.
   * @returns {Promise<void>} A promise that resolves when the item is deleted.
   *
   * @example
   * await repository.deleteItem({ id: '123' });
   *
   * @throws {InternalServerError} If there is an internal error in the AWS DynamoDB service.
   * @throws {ProvisionedThroughputExceededException} If the request exceeds the provisioned throughput for the table.
   * @throws {RequestLimitExceeded} If the request limit for the account is exceeded.
   * @throws {ResourceNotFoundException} If the specified resource (table or index) does not exist.
   * @throws {TransactionConflictException} If there is a conflict with a transaction.
   *
   * This function uses the AWS SDK commands:
   * - {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/DeleteItemCommand/ | DeleteItemCommandt
   */
  async deleteItem(key: Key): Promise<void> {
    this.schema.validateKey(
      key as unknown as Record<string, unknown>
    );

    const params: DeleteItemCommandInput = {
      TableName: this.schema.getTableName(),
      Key: marshall(key),
    };

    const command: DeleteItemCommand = new DeleteItemCommand(params);

    await this.client.send(command);

    this.eventsLogger.itemDeleted(key);
  }

  /**
   * Inserts or deletes multiple items in a single batch operation.
   * If an item already exists, it will be updated.
   * If an error occurs, the unprocessed items will be returned.
   *
   * @param {T[]} putItems - Items to be inserted or updated.
   * @param {Key[]} [deleteKeys=[]] - Keys of items to be deleted.
   * @returns {Promise<UnprocessedItems>} An array of unprocessed items, if any.
   *
   * @example
   * await repository.batchWriteItems([{ id: '1' }, { id: '2' }], [{ primaryKey: '3' }]);
   *
   * @example
   * const unprocessedItems = await repository.batchWriteItems([{ id: '1' }, { id: '2' }]);
   * console.log(unprocessedItems); // [{ type: 'put', item: { id: '1' } }, { type: 'put', item: { id: '2' } }]
   *
   * @throws {InternalServerError} If there is an internal error in the AWS DynamoDB service.
   * @throws {ProvisionedThroughputExceededException} If the request exceeds the provisioned throughput for the table.
   * @throws {RequestLimitExceeded} If the request limit for the account is exceeded.
   * @throws {ResourceNotFoundException} If the specified resource (table or index) does not exist.
   * @throws {MaxItemsExceededError} If the number of items exceeds the maximum batch size.
   *
   * This function uses the AWS SDK commands:
   * - {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/BatchWriteItemCommand/ | BatchWriteItemCommand}
   */
  async batchWriteItems(
    putItems: T[],
    deleteKeys: Key[] = [],
  ): Promise<UnprocessedItems<T>> {
    const helper = new BatchWriteHelper<T>(
      this.client,
      this.schema.getTableName(),
    );
    const requests = helper.buildBatchRequests(putItems, deleteKeys);

    if (requests.length > this.maxBatchItems) {
      throw new MaxItemsExceededError(this.maxBatchItems);
    }

    const batches = helper.chunkRequests(requests);

    const unprocessedItems = await helper.executeBatches(batches);

    this.eventsLogger.batchWritePerformed(putItems, deleteKeys, unprocessedItems);

    return unprocessedItems;
  }

  /**
   * Updates an item in the DynamoDB table based on the provided key.
   *
   * @param {UpdateBuilder} update - The update definition.
   * @param {Key} key - The key identifying the item to update.
   * @param {ConditionBuilder} [condition] - (Optional) A condition to check before updating.
   * @returns {Promise<T | null>} The updated item or null if the operation fails.
   *
   * @example
   * const update = new UpdateBuilder().set('name', 'New Name');
   * const updatedItem = await repository.update(update, { primaryKey: '123' });
   *
   * @throws {InternalServerError} If there is an internal error in the AWS DynamoDB service.
   * @throws {ItemCollectionSizeLimitExceededException} If the item collection size limit is exceeded (for local secondary indexes).
   * @throws {ProvisionedThroughputExceededException} If the request exceeds the provisioned throughput for the table.
   * @throws {RequestLimitExceeded} If the request limit for the account is exceeded.
   * @throws {ResourceNotFoundException} If the specified resource (table or index) does not exist.
   * @throws {TransactionConflictException} If there is a conflict with a transaction.
   * @throws {ConditionalCheckFailedException} If the condition specified in the operation is not met.
   *
   * This function uses the AWS SDK commands:
   * - {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/UpdateItemCommand/ | UpdateItemCommand}
   */
  async update(
    update: UpdateBuilder,
    key: Key,
    condition?: ConditionBuilder,
  ): Promise<T | null> {
    const keyValidated = this.schema.validateKey(
      key as unknown as Record<string, unknown>,
    );

    const {
      UpdateExpression,
      ExpressionAttributeNames: updateAttrNames,
      ExpressionAttributeValues: updateAttrValues,
    } = update.build();

    const params: UpdateItemCommandInput = {
      TableName: this.schema.getTableName(),
      Key: marshall(keyValidated),
      UpdateExpression,
      ExpressionAttributeNames: updateAttrNames,
      ExpressionAttributeValues: updateAttrValues,
      ReturnValues: 'ALL_NEW',
    };

    if (condition) {
      const {
        ConditionExpression,
        ExpressionAttributeNames: conditionAttrNames,
        ExpressionAttributeValues: conditionAttrValues,
      } = condition.build();

      params.ConditionExpression = ConditionExpression;
      params.ExpressionAttributeNames = merge(
        {},
        params.ExpressionAttributeNames,
        conditionAttrNames,
      );
      params.ExpressionAttributeValues = merge(
        {},
        params.ExpressionAttributeValues,
        conditionAttrValues,
      );
    }

    const command: UpdateItemCommand = new UpdateItemCommand(params);

    const response: UpdateItemCommandOutput = await this.client.send(command);

    this.eventsLogger.itemUpdated(key, update.build(), condition.build());

    return response.Attributes ? (unmarshall(response.Attributes) as T) : null;
  }
}
