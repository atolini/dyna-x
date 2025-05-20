/**
 * @typedef {Record<string, number | string>} Key
 *
 * @description
 * Represents the primary key structure for a DynamoDB item.
 * Each key is a string mapped to either a string or number value,
 * typically corresponding to the partition key and (optionally) sort key.
 */
export type Key = Record<string, number | string>;
