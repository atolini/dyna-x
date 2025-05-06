import {
  AttributeValue,
  BatchWriteItemCommand,
  BatchWriteItemCommandInput,
  BatchWriteItemCommandOutput,
  DeleteItemCommand,
  DeleteItemCommandInput,
  DeleteItemCommandOutput,
  DynamoDBClient,
  GetItemCommand,
  GetItemCommandInput,
  GetItemCommandOutput,
  PutItemCommand,
  PutItemCommandInput,
  PutItemCommandOutput,
  QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
  UpdateItemCommand,
  UpdateItemCommandInput,
  UpdateItemCommandOutput,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import * as _ from 'lodash';
import { merge } from 'lodash';
import { ILogger } from '../../../../../utils/logger/contracts';
import { IRepository } from '../../../contracts/repository';
import {
  ConditionBuilder,
  ConditionExpressionResult,
} from '../condition-builder';
import { MaxItemsExceededError } from '../errors/max-item-exceeded-error';
import { DynaXSchema } from '../schema';
import { UpdateBuilder, UpdateExpressionResult } from '../update-builder';

/**
 * Represents a key used to identify an item in a DynamoDB table.
 * Typically consists of a mandatory primary key and an optional sort key.
 *
 * @property {any} primaryKey - The primary key value of the item.
 * @property {any} [sortKey] - (Optional) The sort key value of the item.
 *
 * @example
 * const key: Key = {
 *   primaryKey: 'user#123',
 *   sortKey: 'order#456',
 * };
 *
 * @example
 * const keyWithoutSort: Key = {
 *   primaryKey: 'user#123',
 * };
 */
export interface Key {
  primaryKey: any;
  sortKey?: any;
}

/**
 * Generic repository interface for interacting with DynamoDB tables using a defined schema.
 * Defines methods for retrieving, inserting, updating, and deleting items,
 * as well as supporting batch operations and conditional updates.
 *
 * @template T - The type representing the structure of the items stored in the DynamoDB table.
 * @implements {IRepository<T, Key, ConditionExpressionResult, UpdateExpressionResult>}.
 */
export class DynaXRepository<T>
  implements
    IRepository<T, Key, ConditionExpressionResult, UpdateExpressionResult>
{
  private schema: DynaXSchema;
  private client: DynamoDBClient;
  private logger: ILogger<any>;
  private maxBatchItems: number;

  /**
   * Initializes the repository with a schema and a DynamoDB client.
   *
   * @param {DynaXSchema} schema - The schema defining the table structure.
   * @param {ILogger<any>} logger - (Optional) The logger instance.
   * @param {string} [region] - (Optional) AWS region to configure the DynamoDB client.
   * @param {number} [maxBatchItems=1000] - (Optional) The maximum number of items allowed in one batch write.
   */
  constructor(
    schema: DynaXSchema,
    logger?: ILogger<any>,
    region?: string,
    maxBatchItems: number = 1000,
  ) {
    this.schema = schema;
    this.client = new DynamoDBClient(region ? { region: region } : {});
    this.logger = logger;
    this.maxBatchItems = maxBatchItems;
  }

  /**
   * Retrieves an item from the DynamoDB table based on the primary key.
   *
   * @param {Record<string, any>} key - The key identifying the item.
   * @returns {Promise<T | null>} The retrieved item, or null if not found.
   *
   * @example
   * const item = await repository.getItem({ id: '123' });
   * console.log(item); // { id: '123', name: 'Test' }
   *
   * @throws {InternalServerError} If there is an internal error in the AWS DynamoDB service.
   * @throws {ProvisionedThroughputExceededException} If the request exceeds the provisioned throughput for the table.
   * @throws {RequestLimitExceeded} If the request limit for the account is exceeded.
   * @throws {ResourceNotFoundException} If the specified resource (table or index) does not exist.
   *
   * This function uses the AWS SDK commands:
   * - {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/GetItemCommand/ | GetItemCommand}
   */
  async getItem(key: Record<string, any>): Promise<T | null> {
    const params: GetItemCommandInput = {
      TableName: this.schema.getTableName(),
      Key: marshall(key),
    };

    if (this.logger)
      this.logger.info({
        message: `[DynamoDB] - GetItem`,
        params,
      });

    const command: GetItemCommand = new GetItemCommand(params);

    const response: GetItemCommandOutput = await this.client.send(command);

    if (this.logger)
      this.logger.info({
        message: `[DynamoDB] - GetItem Result`,
        response,
      });

    return response.Item ? (unmarshall(response.Item) as unknown as T) : null;
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
    const params: PutItemCommandInput = {
      TableName: this.schema.getTableName(),
      Item: item as unknown as Record<string, any>,
    };

    if (this.logger)
      this.logger.info({
        message: `[DynamoDB] - PutItem`,
        params,
      });

    const command: PutItemCommand = new PutItemCommand(params);

    const response: PutItemCommandOutput = await this.client.send(command);

    if (this.logger)
      this.logger.info({
        message: `[DynamoDB] - PutItem Result`,
        response,
      });

    return unmarshall(response.Attributes!) as unknown as T;
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
  async deleteItem(key: Record<string, any>): Promise<void> {
    const params: DeleteItemCommandInput = {
      TableName: this.schema.getTableName(),
      Key: key,
    };

    if (this.logger)
      this.logger.info({
        message: `[DynamoDB] - DeleteItem`,
        params,
      });

    const command: DeleteItemCommand = new DeleteItemCommand(params);

    const response: DeleteItemCommandOutput = await this.client.send(command);

    if (this.logger)
      this.logger.info({
        message: `[DynamoDB] - DeleteItem Result`,
        response,
      });

    return;
  }

  /**
   * Inserts or deletes multiple items in a single batch operation.
   * If an item already exists, it will be updated.
   * If an error occurs, the unprocessed items will be returned.
   *
   * @param {T[]} putItems - Items to be inserted or updated.
   * @param {Key[]} [deleteKeys=[]] - Keys of items to be deleted.
   * @returns {Promise<Array<{ type: 'put' | 'delete'; item: T | Key }>>} An array of unprocessed items, if any.
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
  ): Promise<Array<{ type: 'put' | 'delete'; item: T | Key }>> {
    const tableName = this.schema.getTableName();

    const putRequests = putItems.map((item) => ({
      PutRequest: {
        Item: marshall(item) as unknown as Record<string, AttributeValue>,
      },
    }));

    const deleteRequests = deleteKeys.map((key) => ({
      DeleteRequest: {
        Key: marshall(key) as unknown as Record<string, AttributeValue>,
      },
    }));

    const requests = [...putRequests, ...deleteRequests];

    if (requests.length > this.maxBatchItems) {
      throw new MaxItemsExceededError(this.maxBatchItems);
    }

    let unprocessedItems: Array<{ type: 'put' | 'delete'; item: T | Key }> = [];

    const batchs = _.chunk(requests, 25);

    await Promise.all(
      batchs.map(async (batch, i, batchs) => {
        const params: BatchWriteItemCommandInput = {
          RequestItems: {
            [tableName]: batch,
          },
        };

        if (this.logger)
          this.logger.info({
            message: `[DynamoDB] - BatchWrite`,
            batch: `${i}/${batchs.length}`,
            batchSize: batch.length,
          });

        const command = new BatchWriteItemCommand(params);
        const response: BatchWriteItemCommandOutput =
          await this.client.send(command);

        if (response.UnprocessedItems?.[tableName]) {
          const humanReadableItems = response.UnprocessedItems[tableName].map(
            (unprocessed) => {
              if (unprocessed.PutRequest) {
                return {
                  type: 'put' as const,
                  item: unmarshall(
                    unprocessed.PutRequest.Item!,
                  ) as unknown as T,
                };
              } else {
                return {
                  type: 'delete' as const,
                  item: unmarshall(
                    unprocessed.DeleteRequest!.Key!,
                  ) as unknown as Key,
                };
              }
            },
          );

          if (this.logger)
            this.logger.info({
              message: `[DynamoDB] - BatchWrite Result`,
              batch: i,
              unprocessedItems: humanReadableItems,
            });

          unprocessedItems.push(...humanReadableItems);
        }
      }),
    );

    if (this.logger)
      this.logger.info({
        message: `[DynamoDB] - BatchWriteItemCommand Result`,
        metadata: {
          items: requests.length,
          processedItems: requests.length - unprocessedItems.length,
          unprocessedItems: unprocessedItems.length,
        },
        unprocessedItems,
      });

    return unprocessedItems;
  }

  /**
   * Queries items from the DynamoDB table based on a condition.
   *
   * @param {ConditionBuilder} condition - The condition to filter results.
   * @param {string} [indexName] - (Optional) The name of the index to query.
   * @param {boolean} [consistentRead=false] - (Optional) Whether to use consistent read.
   * @param {number} [limit=100] - (Optional) The maximum number of items to return.
   * @returns {Promise<T[] | null>} A list of matching items or null if none found.
   *
   * @example
   * const condition = new ConditionBuilder().where('id').equals('123');
   * const items = await repository.query(condition);
   *
   * @throws {InternalServerError} If there is an internal error in the AWS DynamoDB service.
   * @throws {ProvisionedThroughputExceededException} If the request exceeds the provisioned throughput for the table.
   * @throws {RequestLimitExceeded} If the request limit for the account is exceeded.
   * @throws {ResourceNotFoundException} If the specified resource (table or index) does not exist.
   *
   * This function uses the AWS SDK commands:
   * - {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/QueryCommand/ | QueryCommand}
   */
  async query(
    condition: ConditionBuilder,
    indexName?: string,
    consistentRead: boolean = false,
    limit: number = 100,
  ): Promise<T[] | null> {
    const result = condition.build();

    const params: QueryCommandInput = {
      TableName: this.schema.getTableName(),
      KeyConditionExpression: result.ConditionExpression,
      ExpressionAttributeNames: result.ExpressionAttributeNames,
      ExpressionAttributeValues: result.ExpressionAttributeValues,
      ConsistentRead: consistentRead,
      Limit: limit,
    };

    if (indexName) {
      params.IndexName = indexName;
    }

    if (this.logger)
      this.logger.info({
        message: `[DynamoDB] - QueryItem`,
        params,
      });

    const command = new QueryCommand(params);

    const response: QueryCommandOutput = await this.client.send(command);

    if (this.logger)
      this.logger.info({
        message: `[DynamoDB] - QueryItem Result`,
        response,
      });

    return response.Items
      ? (response.Items.map((i) => unmarshall(i)) as T[])
      : null;
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
    const {
      UpdateExpression,
      ExpressionAttributeNames: updateAttrNames,
      ExpressionAttributeValues: updateAttrValues,
    } = update.build();

    const params: UpdateItemCommandInput = {
      TableName: this.schema.getTableName(),
      Key: marshall(key),
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

    this.logger.info({
      message: `[DynamoDB] - UpdateItem`,
      params,
    });

    const command: UpdateItemCommand = new UpdateItemCommand(params);

    const response: UpdateItemCommandOutput = await this.client.send(command);

    this.logger.info({
      message: `[DynamoDB] - UpdateItem Result`,
      response,
    });

    return response.Attributes ? (unmarshall(response.Attributes) as T) : null;
  }
}
