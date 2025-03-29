import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ConditionBuilder } from "./condition-builder";
import { DynaXSchema } from "./dyna-x-schema";
import { UpdateBuilder } from "./update-builder";
import { Logger } from "@aws-lambda-powertools/logger";
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
export declare class DynaXRepository<T> {
    private schema;
    private client;
    private logger;
    private maxBatchItems;
    /**
     * Initializes the repository with a schema and a DynamoDB client.
     *
     * @param {DynaXSchema} schema - The schema defining the table structure.
     * @param {DynamoDBClient} client - The DynamoDB client instance.
     * @param {Logger} logger - The logger instance.
     * @param {number} maxBatchItems - The maximum number of items allowed in one batch write.
     */
    constructor(schema: DynaXSchema, client: DynamoDBClient, logger: Logger, maxBatchItems?: number);
    /**
     * Retrieves an item from the DynamoDB table based on the primary key.
     *
     * @param {Record<string, any>} key - The key identifying the item.
     * @returns {Promise<T | null>} The retrieved item, or null if not found.
     */
    getItem(key: Record<string, any>): Promise<T | null>;
    /**
     * Inserts or updates an item in the DynamoDB table.
     *
     * @param {T} item - The item to be inserted or updated.
     * @returns {Promise<void>} The item updated.
     */
    putItem(item: T): Promise<T>;
    /**
     * Deletes an item from the DynamoDB table based on the primary key.
     *
     * @param {Record<string, any>} key - The key identifying the item to delete.
     * @returns {Promise<void>} A promise that resolves when the item is deleted.
     */
    deleteItem(key: Record<string, any>): Promise<void>;
    /**
     * Inserts or deletes multiple items in a single batch operation.
     * DynamoDB limits batch writes to 25 items per request.
     *
     * @param {T[]} putItems - Items to be inserted or updated.
     * @param {Key[]} [deleteKeys=[]] - Keys of items to be deleted.
     * @returns {Promise<Record<string, any>[]>} An array of unprocessed items, if any.
     */
    batchWriteItems(putItems: T[], deleteKeys?: Key[]): Promise<Array<{
        type: 'put' | 'delete';
        item: T | Key;
    }>>;
    /**
     * Queries items from the DynamoDB table based on a condition.
     *
     * @param {ConditionBuilder} condition - The condition to filter results.
     * @param {string} [indexName] - (Optional) The name of the index to query.
     * @returns {Promise<T[] | null>} A list of matching items or null if none found.
     */
    query(condition: ConditionBuilder, indexName?: string): Promise<T[] | null>;
    /**
     * Updates an item in the DynamoDB table based on the provided key.
     *
     * @param {UpdateBuilder} update - The update definition.
     * @param {Key} key - The key identifying the item to update.
     * @param {ConditionBuilder} [condition] - (Optional) A condition to check before updating.
     * @returns {Promise<T | null>} The updated item or null if the operation fails.
     */
    update(update: UpdateBuilder, key: Key, condition?: ConditionBuilder): Promise<T | null>;
}
//# sourceMappingURL=dyna-x-repository.d.ts.map