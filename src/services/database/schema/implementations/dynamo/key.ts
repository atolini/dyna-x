/**
 * Represents the key object provided by the user that must be validated
 * by the schema before being converted using `marshall` for database operations.
 *
 * This object typically contains the primary key attributes (partition key and,
 * optionally, sort key) required to identify an item in the database.
 */
export type Key = Record<string, unknown>;
