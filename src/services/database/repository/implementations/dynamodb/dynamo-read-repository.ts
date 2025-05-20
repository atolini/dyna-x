import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { DynamoConditionBuilder } from '../../../condition-builder/implementations/dynamo/dynamo-condition-builder';
import { DynamoSchema } from '../../../schema/implementations/dynamo/dynamo-schema';
import { IReadRepository } from '../../contracts/i-read-repository';
import { DynamoReadRepositoryEventLogger } from './dynamo-read-repository-event-logger';
import { Key } from './key';
import {
  DynamoDBClient,
  GetItemCommand,
  GetItemCommandInput,
  GetItemCommandOutput,
  QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
} from '@aws-sdk/client-dynamodb';
import { DynamoConditionExpressionResult } from '../../../condition-builder/implementations/dynamo/dynamo-condition-expression-result';

/**
 *
 */
export class DynamoReadRepository<T>
  implements IReadRepository<T, Key, DynamoConditionExpressionResult>
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
    private readonly eventLogger: DynamoReadRepositoryEventLogger<T>,
    region: string,
  ) {
    this.client = new DynamoDBClient(region ? { region: region } : {});
    this.tableName = this.schema.getTableName();
  }

  /**
   *
   * @param key
   */
  async getItem(key: Key): Promise<T | null> {
    this.validateKey(key);

    const params: GetItemCommandInput = {
      TableName: this.tableName,
      Key: marshall(key),
    };

    const command: GetItemCommand = new GetItemCommand(params);

    const response: GetItemCommandOutput = await this.client.send(command);

    const item = response.Item
      ? (unmarshall(response.Item) as unknown as T)
      : null;

    this.eventLogger.itemFetched(key, item);

    return item;
  }

  /**
   *
   * @param condition
   * @param indexName
   * @param consistentRead
   * @param limit
   * @param exclusiveStartKey
   */
  async query(
    condition: DynamoConditionBuilder,
    indexName?: string,
    consistentRead: boolean = false,
    limit?: number,
    exclusiveStartKey?: Key,
  ): Promise<{ items: T[]; lastEvaluatedKey?: Key }> {
    const {
      ConditionExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
    } = condition.build();

    const params: QueryCommandInput = {
      TableName: this.tableName,
      KeyConditionExpression: ConditionExpression,
      ExpressionAttributeNames: ExpressionAttributeNames,
      ExpressionAttributeValues: ExpressionAttributeValues,
      ConsistentRead: consistentRead,
      Limit: limit,
      ExclusiveStartKey: exclusiveStartKey
        ? marshall(exclusiveStartKey)
        : undefined,
    };

    if (indexName) {
      params.IndexName = indexName;
    }

    const command = new QueryCommand(params);

    const response: QueryCommandOutput = await this.client.send(command);

    const items = response.Items
      ? (response.Items.map((i) => unmarshall(i)) as T[])
      : [];

    const lastEvaluatedKey = response.LastEvaluatedKey
      ? (unmarshall(response.LastEvaluatedKey) as unknown as Key)
      : undefined;

    this.eventLogger.queryExecuted(condition.build(), items, lastEvaluatedKey);

    return {
      items,
      lastEvaluatedKey,
    };
  }

  /**
   *
   * @param key
   */
  private validateKey(key: Key) {
    this.schema.validateKey(key);
  }
}
