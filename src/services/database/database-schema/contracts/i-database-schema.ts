/**
 * @interface IDatabaseSchema
 * @template K - Key (unique identifier)
 *
 * @description
 * Describes the contract for a schema that defines the structure of a DynamoDB table,
 * including key validation and table name access.
 */
export interface IDatabaseSchema<K> {
  /**
   * Retrieves the configured table name.
   *
   * @returns The DynamoDB table name.
   */
  getTableName(): string;

  /**
   * Validates a key object to ensure it includes required attributes with correct types.
   *
   * @param key - A record representing the key attributes to validate.
   * @throws {InvalidKeyError} If validation fails due to missing or invalid attributes.
   */
  validateKey(key: K): void;
}
