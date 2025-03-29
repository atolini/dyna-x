import { BatchWriteItemCommand, DeleteItemCommand, GetItemCommand, PutItemCommand, QueryCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { merge } from 'lodash';
import * as _ from "lodash";
import { MaxItemsExceededError } from "./max-item-exceeded-error";
/**
 * Generic repository for interacting with DynamoDB tables using a defined schema.
 * Provides methods for retrieving, inserting, updating, and deleting items.
 *
 * @template T - The type of item stored in the DynamoDB table.
 */
export class DynaXRepository {
    schema;
    client;
    logger;
    maxBatchItems;
    /**
     * Initializes the repository with a schema and a DynamoDB client.
     *
     * @param {DynaXSchema} schema - The schema defining the table structure.
     * @param {DynamoDBClient} client - The DynamoDB client instance.
     * @param {Logger} logger - The logger instance.
     * @param {number} maxBatchItems - The maximum number of items allowed in one batch write.
     */
    constructor(schema, client, logger, maxBatchItems = 1000) {
        this.schema = schema;
        this.client = client;
        this.logger = logger;
        this.maxBatchItems = maxBatchItems;
    }
    /**
     * Retrieves an item from the DynamoDB table based on the primary key.
     *
     * @param {Record<string, any>} key - The key identifying the item.
     * @returns {Promise<T | null>} The retrieved item, or null if not found.
     */
    async getItem(key) {
        const params = {
            TableName: this.schema.getTableName(),
            Key: marshall(key),
        };
        this.logger.info({
            message: `[DynamoDB] - GetItem`,
            params
        });
        const command = new GetItemCommand(params);
        const response = await this.client.send(command);
        this.logger.info({
            message: `[DynamoDB] - GetItem Result`,
            response,
        });
        return response.Item ? unmarshall(response.Item) : null;
        ;
    }
    /**
     * Inserts or updates an item in the DynamoDB table.
     *
     * @param {T} item - The item to be inserted or updated.
     * @returns {Promise<void>} The item updated.
     */
    async putItem(item) {
        const params = {
            TableName: this.schema.getTableName(),
            Item: item,
        };
        this.logger.info({
            message: `[DynamoDB] - PutItem`,
            params
        });
        const command = new PutItemCommand(params);
        const response = await this.client.send(command);
        this.logger.info({
            message: `[DynamoDB] - PutItem Result`,
            response,
        });
        return unmarshall(response.Attributes);
    }
    /**
     * Deletes an item from the DynamoDB table based on the primary key.
     *
     * @param {Record<string, any>} key - The key identifying the item to delete.
     * @returns {Promise<void>} A promise that resolves when the item is deleted.
     */
    async deleteItem(key) {
        const params = {
            TableName: this.schema.getTableName(),
            Key: key,
        };
        this.logger.info({
            message: `[DynamoDB] - DeleteItem`,
            params
        });
        const command = new DeleteItemCommand(params);
        const response = await this.client.send(command);
        this.logger.info({
            message: `[DynamoDB] - DeleteItem Result`,
            response
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
    async batchWriteItems(putItems, deleteKeys = []) {
        const tableName = this.schema.getTableName();
        const putRequests = putItems.map(item => ({
            PutRequest: {
                Item: marshall(item)
            }
        }));
        const deleteRequests = deleteKeys.map(key => ({
            DeleteRequest: {
                Key: marshall(key)
            }
        }));
        const requests = [...putRequests, ...deleteRequests];
        if (requests.length > this.maxBatchItems) {
            throw new MaxItemsExceededError(this.maxBatchItems);
        }
        let unprocessedItems = [];
        const batchs = _.chunk(requests, 25);
        await Promise.all(batchs.map(async (batch, i, batchs) => {
            const params = {
                RequestItems: {
                    [tableName]: batch
                }
            };
            this.logger.info({
                message: `[DynamoDB] - BatchWrite`,
                batch: `${i}/${batchs.length}`,
                batchSize: batch.length
            });
            const command = new BatchWriteItemCommand(params);
            const response = await this.client.send(command);
            if (response.UnprocessedItems?.[tableName]) {
                const humanReadableItems = response.UnprocessedItems[tableName].map(unprocessed => {
                    if (unprocessed.PutRequest) {
                        return {
                            type: 'put',
                            item: unmarshall(unprocessed.PutRequest.Item)
                        };
                    }
                    else {
                        return {
                            type: 'delete',
                            item: unmarshall(unprocessed.DeleteRequest.Key)
                        };
                    }
                });
                this.logger.info({
                    message: `[DynamoDB] - BatchWrite Result`,
                    batch: i,
                    unprocessedItems: humanReadableItems
                });
                unprocessedItems.push(...humanReadableItems);
            }
        }));
        this.logger.info({
            message: `[DynamoDB] - BatchWriteItemCommand Result`,
            metadata: {
                items: requests.length,
                processedItems: requests.length - unprocessedItems.length,
                unprocessedItems: unprocessedItems.length
            },
            unprocessedItems
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
    async query(condition, indexName) {
        const result = condition.build();
        const params = {
            TableName: this.schema.getTableName(),
            KeyConditionExpression: result.ConditionExpression,
            ExpressionAttributeNames: result.ExpressionAttributeNames,
            ExpressionAttributeValues: result.ExpressionAttributeValues
        };
        if (indexName) {
            params.IndexName = indexName;
        }
        this.logger.info({
            message: `[DynamoDB] - QueryItem`,
            params
        });
        const command = new QueryCommand(params);
        const response = await this.client.send(command);
        this.logger.info({
            message: `[DynamoDB] - QueryItem Result`,
            response
        });
        return response.Items ? response.Items.map((i) => unmarshall(i)) : null;
    }
    /**
     * Updates an item in the DynamoDB table based on the provided key.
     *
     * @param {UpdateBuilder} update - The update definition.
     * @param {Key} key - The key identifying the item to update.
     * @param {ConditionBuilder} [condition] - (Optional) A condition to check before updating.
     * @returns {Promise<T | null>} The updated item or null if the operation fails.
     */
    async update(update, key, condition) {
        const { UpdateExpression, ExpressionAttributeNames: updateAttrNames, ExpressionAttributeValues: updateAttrValues, } = update.build();
        const params = {
            TableName: this.schema.getTableName(),
            Key: marshall(key),
            UpdateExpression,
            ExpressionAttributeNames: updateAttrNames,
            ExpressionAttributeValues: updateAttrValues,
            ReturnValues: 'ALL_NEW',
        };
        if (condition) {
            const { ConditionExpression, ExpressionAttributeNames: conditionAttrNames, ExpressionAttributeValues: conditionAttrValues, } = condition.build();
            params.ConditionExpression = ConditionExpression;
            params.ExpressionAttributeNames = merge({}, params.ExpressionAttributeNames, conditionAttrNames);
            params.ExpressionAttributeValues = merge({}, params.ExpressionAttributeValues, conditionAttrValues);
        }
        this.logger.info({
            message: `[DynamoDB] - UpdateItem`,
            params
        });
        const command = new UpdateItemCommand(params);
        const response = await this.client.send(command);
        this.logger.info({
            message: `[DynamoDB] - UpdateItem Result`,
            response
        });
        return response.Attributes ? unmarshall(response.Attributes) : null;
    }
}
