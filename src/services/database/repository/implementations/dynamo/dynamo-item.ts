/**
 * @typedef {Record<string, unknown>} DynamoItem
 *
 * @description
 * Represents a generic item structure used in DynamoDB operations.
 * Each item is a key-value map where the key is a string and the value can be of any type.
 * This is typically used as a base type for items stored in DynamoDB tables.
 */
export type DynamoItem = Record<string, unknown>;
