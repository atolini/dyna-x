/**
 * Represents a key used to identify an item in a DynamoDB table.
 * Typically consists of a mandatory primary key and an optional sort key.
 *
 * @property {any} primaryKey - The primary key value of the item.
 * @property {any} [sortKey] - (Optional) The sort key value of the item.
 *
 * @example
 * const key: Key = {
 *   primaryKey: 'user#123',
 *   sortKey: 'order#456',
 * };
 *
 * @example
 * const keyWithoutSort: Key = {
 *   primaryKey: 'user#123',
 * };
 */
export interface Key {
  primaryKey: any;
  sortKey?: any;
}
