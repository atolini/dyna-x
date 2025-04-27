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
import { merge } from 'lodash';
import { ConditionBuilder } from '../condition-builder';
import { DynaXSchema } from '../schema';
import { UpdateBuilder } from '../update-builder';
import * as _ from 'lodash';
import { ILogger } from '../../../../../utils/logger/contracts';
import { MaxItemsExceededError } from '../errors/max-item-exceeded-error';
import { IRepository } from '../../../contracts/repository';
import { ConditionExpressionResult } from '../condition-builder/condition-expression-result';
import { UpdateExpressionResult } from '../update-builder/update-expression-result';

export interface Key {
  primaryKey: any;
  sortKey?: any;
}

/**
 * Generic repository for interacting with DynamoDB tables using a defined schema.
 * Provides methods for retrieving, inserting, updating, and deleting items.
 *
 * @template T - The type of item stored in the DynamoDB table.
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
   * @param {ILogger<any>} logger - The logger instance.
   * @param {string} [region] - (Optional) AWS region to configure the DynamoDB client.
   * @param {number} [maxBatchItems=1000] - (Optional) The maximum number of items allowed in one batch write.
   */
  constructor(
    schema: DynaXSchema,
    logger: ILogger<any>,
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
   */
  async getItem(key: Record<string, any>): Promise<T | null> {
    const params: GetItemCommandInput = {
      TableName: this.schema.getTableName(),
      Key: marshall(key),
    };

    this.logger.info({
      message: `[DynamoDB] - GetItem`,
      params,
    });

    const command: GetItemCommand = new GetItemCommand(params);

    const response: GetItemCommandOutput = await this.client.send(command);

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
   * @returns {Promise<void>} The item updated.
   */
  async putItem(item: T): Promise<T> {
    const params: PutItemCommandInput = {
      TableName: this.schema.getTableName(),
      Item: item as unknown as Record<string, any>,
    };

    this.logger.info({
      message: `[DynamoDB] - PutItem`,
      params,
    });

    const command: PutItemCommand = new PutItemCommand(params);

    const response: PutItemCommandOutput = await this.client.send(command);

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
   */
  async deleteItem(key: Record<string, any>): Promise<void> {
    const params: DeleteItemCommandInput = {
      TableName: this.schema.getTableName(),
      Key: key,
    };

    this.logger.info({
      message: `[DynamoDB] - DeleteItem`,
      params,
    });

    const command: DeleteItemCommand = new DeleteItemCommand(params);

    const response: DeleteItemCommandOutput = await this.client.send(command);

    this.logger.info({
      message: `[DynamoDB] - DeleteItem Result`,
      response,
    });

    return;
  }

  /**
   * Inserts or deletes multiple items in a single batch operation.
   * DynamoDB limits batch writes to 25 items per request.
   *
   * @param {T[]} putItems - Items to be inserted or updated.
   * @param {Key[]} [deleteKeys=[]] - Keys of items to be deleted.
   * @returns {Promise<Record<string, any>[]>} An array of unprocessed items, if any.
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

          this.logger.info({
            message: `[DynamoDB] - BatchWrite Result`,
            batch: i,
            unprocessedItems: humanReadableItems,
          });

          unprocessedItems.push(...humanReadableItems);
        }
      }),
    );

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
   * @returns {Promise<T[] | null>} A list of matching items or null if none found.
   */
  async query(
    condition: ConditionBuilder,
    indexName?: string,
  ): Promise<T[] | null> {
    const result = condition.build();

    const params: QueryCommandInput = {
      TableName: this.schema.getTableName(),
      KeyConditionExpression: result.ConditionExpression,
      ExpressionAttributeNames: result.ExpressionAttributeNames,
      ExpressionAttributeValues: result.ExpressionAttributeValues,
    };

    if (indexName) {
      params.IndexName = indexName;
    }

    this.logger.info({
      message: `[DynamoDB] - QueryItem`,
      params,
    });

    const command = new QueryCommand(params);

    const response: QueryCommandOutput = await this.client.send(command);

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
