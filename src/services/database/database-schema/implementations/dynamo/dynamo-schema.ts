import { IDatabaseSchema } from '../../contracts/i-database-schema';
import { KeyConfig } from './key-config';
import { InvalidKeyError } from './invalid-key-error';

type Key = Record<string, unknown>;

/**
 * @class DynamoSchema
 *
 * @classdesc
 * Represents the schema definition for a DynamoDB table, including table name and key configuration.
 * Provides validation to ensure that partition and sort keys are correctly structured and typed.
 *
 * @example
 * const schema = new DynamoDBSchema(
 *   'UsersTable',
 *   { name: 'userId', type: 'string' },
 *   { name: 'createdAt', type: 'number' }
 * );
 *
 * schema.getTableName(); // returns 'UsersTable'
 * schema.validateKey({ userId: 'abc123', createdAt: 1692451820 }); // passes
 */
export class DynamoSchema implements IDatabaseSchema<Key> {
  private tableName: string;
  private partitionKey: KeyConfig;
  private sortKey?: KeyConfig;

  /**
   * Creates an instance of DynamoSchema.
   *
   * @param {string} tableName - The name of the DynamoDB table.
   * @param {KeyConfig} partitionKey - Configuration for the partition (hash) key.
   * @param {KeyConfig} [sortKey] - Optional configuration for the sort (range) key.
   */
  constructor(tableName: string, partitionKey: KeyConfig, sortKey?: KeyConfig) {
    this.tableName = tableName;
    this.partitionKey = partitionKey;
    this.sortKey = sortKey;
  }

  /**
   * Retrieves the name of the DynamoDB table configured in this schema.
   *
   * @returns {string} The name of the DynamoDB table.
   */
  getTableName(): string {
    return this.tableName;
  }

  /**
   * Validates that a given object contains the required key fields
   * with the correct types as defined in the schema.
   *
   * @param {Record<string, unknown>} key - The key object to validate.
   * @throws {InvalidKeyError} If required keys are missing or types are incorrect.
   */
  validateKey(key: Key) {
    this.validateField(this.partitionKey, key);

    if (this.sortKey) {
      this.validateField(this.sortKey, key);
    }
  }

  /**
   * Internal helper to validate the presence and type of a single key field.
   *
   * @private
   * @param {KeyConfig} field - The key configuration to validate.
   * @param {Record<string, unknown>} key - The input object containing key fields.
   * @throws {InvalidKeyError} If the field is missing or its type is incorrect.
   */
  private validateField(field: KeyConfig, key: Record<string, unknown>): void {
    const value = key[field.name];

    if (value === undefined) {
      throw new InvalidKeyError(`Missing required key: ${field.name}`);
    }

    const actualType = typeof value;

    if (actualType !== field.type) {
      throw new InvalidKeyError(
        `Invalid type for key "${field.name}". Expected "${field.type}", got "${actualType}".`,
      );
    }
  }
}
