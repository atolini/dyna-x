import {
    DynamoDBClient,
    GetItemCommand,
    GetItemCommandInput,
    GetItemCommandOutput,
    QueryCommand,
    QueryCommandInput,
    QueryCommandOutput
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { ILogger } from '../../../../../utils/logger/contracts';
import { IReadRepository } from '../../../contracts/repository';
import {
    ConditionBuilder,
    ConditionExpressionResult,
} from '../condition-builder';
import { DynaXSchema } from '../schema';
import { Key } from './key';

/**
 * @class DynaXRepository
 * @implements {IRepository<T, Key, ConditionExpressionResult, UpdateExpressionResult>}
 * @template T - The type representing the structure of the items stored in the DynamoDB table.
 *
 * Generic repository interface for interacting with DynamoDB tables using a defined schema.
 * Defines methods for retrieving, inserting, updating, and deleting items,
 * as well as supporting batch operations and conditional updates.
 */
export class DynaXReadRepository<T>
  implements
    IReadRepository<T, Key, ConditionExpressionResult>
{
  private schema: DynaXSchema;
  private client: DynamoDBClient;
  private logger: ILogger<any>;

  /**
   * Initializes the repository with a schema and a DynamoDB client.
   *
   * @param {DynaXSchema} schema - The schema defining the table structure.
   * @param {ILogger<any>} logger - (Optional) The logger instance.
   * @param {string} [region] - (Optional) AWS region to configure the DynamoDB client.
   */
  constructor(
    schema: DynaXSchema,
    logger?: ILogger<any>,
    region?: string
  ) {
    this.schema = schema;
    this.client = new DynamoDBClient(region ? { region: region } : {});
    this.logger = logger;
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
    const keyValidated = this.schema.validateKey(
      key as Record<string, unknown>,
    );

    const params: GetItemCommandInput = {
      TableName: this.schema.getTableName(),
      Key: marshall(keyValidated),
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
}
