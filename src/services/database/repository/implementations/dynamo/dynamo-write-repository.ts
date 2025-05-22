import {
  DeleteItemCommand,
  DeleteItemCommandInput,
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
  UpdateItemCommand,
  UpdateItemCommandInput,
  UpdateItemCommandOutput,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { DynamoConditionBuilder } from '@database/condition-builder/implementations/dynamo/dynamo-condition-builder';
import { IWriteRepository } from '@database/repository/contracts/i-write-repository';
import { DynamoItem } from '@database/repository/implementations/dynamo/dynamo-item';
import { DynamoWriteRepositoryEventLogger } from '@database/repository/implementations/dynamo/dynamo-write-repository-event-logger';
import { Key } from '@database/repository/implementations/dynamo/key';
import { DynamoSchema } from '@database/schema/implementations/dynamo/dynamo-schema';
import { DynamoUpdateBuilder } from '@database/update-builder/implementations/dynamo/dynamo-update-builder';
import { merge } from 'lodash';

/**
 * @class DynamoWriteRepository
 * @template T - The type of item managed by the repository, which extends DynamoItem.
 *
 * @classdesc
 * Repository implementation for writing data to a DynamoDB table.
 * Handles create, update, and delete operations.
 */
export class DynamoWriteRepository<T extends DynamoItem>
  implements
    IWriteRepository<T, Key, DynamoConditionBuilder, DynamoUpdateBuilder>
{
  private readonly client: DynamoDBClient;
  private readonly tableName: string;

  /**
   * Creates a new instance of DynamoWriteRepository.
   *
   * @param schema - The schema that defines the structure and validation of the items.
   * @param eventLogger - Logger for tracking repository events such as creation, update, and deletion.
   * @param region - AWS region to configure the DynamoDB client.
   */
  constructor(
    private readonly schema: DynamoSchema<T>,
    private readonly eventLogger: DynamoWriteRepositoryEventLogger<T>,
    region: string,
  ) {
    this.client = new DynamoDBClient(region ? { region: region } : {});
    this.tableName = this.schema.getTableName();
  }

  /**
   * Inserts a new item into the DynamoDB table.
   *
   * @param item - The item to be inserted.
   * @returns The inserted item.
   */
  async putItem(item: T): Promise<T> {
    this.schema.validateKey(item);

    const params: PutItemCommandInput = {
      TableName: this.tableName,
      Item: marshall(item),
    };

    const command: PutItemCommand = new PutItemCommand(params);

    await this.client.send(command);

    this.eventLogger.itemCreated(item);

    return item;
  }

  /**
   * Deletes an item from the DynamoDB table based on the provided key.
   *
   * @param key - The primary key of the item to be deleted.
   * @returns A promise that resolves when the item is deleted.
   */
  async deleteItem(key: Key): Promise<void> {
    this.schema.validateKey(key);

    const params: DeleteItemCommandInput = {
      TableName: this.tableName,
      Key: marshall(key),
    };

    const command: DeleteItemCommand = new DeleteItemCommand(params);

    await this.client.send(command);

    this.eventLogger.itemDeleted(key);
  }

  /**
   * Updates an existing item in the DynamoDB table.
   *
   * @param update - The update expression builder containing the update operations.
   * @param key - The primary key of the item to be updated.
   * @param condition - Optional condition expression builder to enforce update constraints.
   * @returns The updated item or null if the item was not found.
   */
  async update(
    update: DynamoUpdateBuilder,
    key: Key,
    condition?: DynamoConditionBuilder,
  ): Promise<T | null> {
    this.schema.validateKey(key);

    const {
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
    } = update.build();

    const params: UpdateItemCommandInput = {
      TableName: this.tableName,
      Key: marshall(key),
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    };

    if (condition) {
      const {
        ConditionExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
      } = condition.build();

      params.ConditionExpression = ConditionExpression;
      params.ExpressionAttributeNames = merge(
        {},
        params.ExpressionAttributeNames,
        ExpressionAttributeNames,
      );
      params.ExpressionAttributeValues = merge(
        {},
        params.ExpressionAttributeValues,
        ExpressionAttributeValues,
      );
    }

    const command: UpdateItemCommand = new UpdateItemCommand(params);

    const response: UpdateItemCommandOutput = await this.client.send(command);

    this.eventLogger.itemUpdated(key, update.build(), condition.build());

    return response.Attributes ? (unmarshall(response.Attributes) as T) : null;
  }
}
