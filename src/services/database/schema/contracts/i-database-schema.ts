/**
 * @interface IDatabaseSchema
 * @template K - Key (unique identifier)
 * @template T - Complete entity or object type that contains the key
 *
 * @description
 * Describes the contract for a database schema that provides key validation
 * and access to a table or collection name.
 */
export interface IDatabaseSchema<K, T = any> {
  /**
   * Retrieves the name of the table, collection, or entity defined by the schema.
   *
   * @returns The name of the database resource.
   */
  getTableName(): string;

  /**
   * Validates the presence and structure of the key in a given object.
   *
   * The key can be provided directly or inferred from a larger object that contains it.
   *
   * @param input - A key object (`K`) or a complete object (`T`) containing the key.
   * @throws {InvalidKeyError} If validation fails due to missing or invalid key attributes.
   */
  validateKey(input: K | T): void;
}
