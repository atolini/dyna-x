import { IDatabaseSchema } from '@database/schema/contracts';
import { InvalidKeyError, Key, KeyConfig } from '@database/schema/implementations/dynamo';

/**
 * @template T - The full object type that includes key attributes and possibly additional data.
 *
 * Represents the schema definition for a DynamoDB-compatible table, including the table name
 * and key configuration (partition and optional sort key). It provides runtime validation to ensure
 * that the required key fields exist and match the expected types, either from a plain key object
 * or a full entity that contains the key attributes.
 *
 * @example
 * const schema = new DynamoSchema(
 *   'UsersTable',
 *   { name: 'userId', type: 'string' },
 *   { name: 'createdAt', type: 'number' }
 * );
 *
 * schema.getTableName(); // returns 'UsersTable'
 * schema.validateKey({ userId: 'abc123', createdAt: 1692451820 }); // passes
 */
export class DynamoSchema<T> implements IDatabaseSchema<Key, T> {
  private readonly tableName: string;
  private readonly partitionKey: KeyConfig;
  private readonly sortKey?: KeyConfig;

  /**
   * Creates an instance of DynamoSchema.
   *
   * @param {string} tableName - The name of the table.
   * @param {KeyConfig} partitionKey - Configuration for the partition (hash) key.
   * @param {KeyConfig} [sortKey] - Optional configuration for the sort (range) key.
   */
  constructor(tableName: string, partitionKey: KeyConfig, sortKey?: KeyConfig) {
    this.tableName = tableName;
    this.partitionKey = partitionKey;
    this.sortKey = sortKey;
  }

  /**
   * Retrieves the configured table name.
   *
   * @returns {string} The name of the table.
   */
  getTableName(): string {
    return this.tableName;
  }

  /**
   * Validates that the given object contains the required key fields
   * with the correct types as defined in the schema.
   *
   * Accepts either a plain key object or a full entity that includes the key attributes.
   * Ensures presence and type correctness of the partition key and, if applicable, the sort key.
   *
   * @param {Key | T} key - Object to validate. May be just the key or a full entity with key attributes.
   * @throws {InvalidKeyError} If any required key field is missing or has an incorrect type.
   */
  validateKey(key: Key | T): void {
    this.validateField(this.partitionKey, key);

    if (this.sortKey) {
      this.validateField(this.sortKey, key);
    }
  }

  /**
   * Validates a single key field for presence and expected type.
   *
   * @private
   * @param {KeyConfig} field - The configuration of the key field to validate.
   * @param {Key | T} key - The object being validated.
   * @throws {InvalidKeyError} If the field is missing or has an incorrect type.
   */
  private validateField(field: KeyConfig, key: Key | T): void {
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
