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
import { IConditionBuilder } from '../../../condition-builder/contracts/i-condition-builder';
import { DynamoConditionExpressionResult } from '../../../condition-builder/implementations/dynamo/dynamo-condition-expression-result';
import { DynamoSchema } from '../../../schema/implementations/dynamo/dynamo-schema';
import { IUpdateBuilder } from '../../../update-builder/contracts/i-update-builder';
import { DynamoUpdateExpressionResult } from '../../../update-builder/implementations/dynamo/dynamo-update-expression-result';
import { IWriteRepository } from '../../contracts/i-write-repository';
import { DynamoWriteRepositoryEventLogger } from './dynamo-write-repository-event-logger';
import { Key } from './key';
import { merge } from 'lodash';

type DynamoItem = Record<string, unknown>;

/**
 *
 */
export class DynamoWriteRepository<T extends DynamoItem>
  implements
    IWriteRepository<
      T,
      Key,
      DynamoConditionExpressionResult,
      DynamoUpdateExpressionResult
    >
{
  private readonly client: DynamoDBClient;
  private readonly tableName: string;

  /**
   *
   * @param schema
   * @param eventLogger
   * @param region
   */
  constructor(
    private readonly schema: DynamoSchema,
    private eventLogger: DynamoWriteRepositoryEventLogger<T>,
    region: string,
  ) {
    this.client = new DynamoDBClient(region ? { region: region } : {});
    this.tableName = this.schema.getTableName();
  }

  /**
   *
   * @param item
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
   *
   * @param key
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
   *
   * @param update
   * @param key
   * @param condition
   */
  async update(
    update: IUpdateBuilder<DynamoUpdateExpressionResult>,
    key: Key,
    condition?: IConditionBuilder<DynamoConditionExpressionResult>,
  ): Promise<T> {
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
