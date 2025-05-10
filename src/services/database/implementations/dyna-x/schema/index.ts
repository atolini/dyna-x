/**
 * This type definition is used to specify the allowed key types for a DynamoDB table schema.
 * It restricts the key types to either 'string' or 'number', ensuring that only valid types
 * are used when defining the schema for a DynamoDB table.
 */
type AllowedKeyType = 'string' | 'number';

/**
 * Configuration for a key field, including its name and expected type.
 */
interface KeyConfig {
  /**
   * The name of the key field.
   */
  name: string;

  /**
   * The expected type of the key field.
   * This should be one of the allowed types: 'string' pr 'number'.
   */
  type: AllowedKeyType;
}

/**
 * @class DynaXSchema
 *
 * @classdesc
 * Represents the schema definition for a DynamoDB table, including table name configuration.
 * This class serves as the base for defining DynamoDB table structures and ensures proper key validation.
 *
 * @example
 * // Basic usage:
 * const schema = new DynaXSchema({
 *   tableName: 'UsersTable'
 * });
 * console.log(schema.getTableName()); // 'UsersTable'
 */
export class DynaXSchema {
  private tableName: string;
  private partitionKey: KeyConfig;
  private sortKey?: KeyConfig;

  /**
   * Creates an instance of DynaXSchema.
   * @constructor
   * @param {object} data - Configuration object for the schema
   * @param {string} data.tableName - The name of the DynamoDB table
   * @param {KeyConfig} data.partitionKey - Configuration for the partition key
   * @param {KeyConfig} data.sortKey - Configuration for the sort key (optional)
   */
  constructor(data: {
    tableName: string;
    partitionKey: KeyConfig;
    sortKey?: KeyConfig;
  }) {
    this.tableName = data.tableName;
  }

  /**
   * Retrieves the name of the DynamoDB table configured in this schema.
   * @returns {string} The name of the DynamoDB table
   *
   * @example
   * const tableName = schema.getTableName();
   * // Use with DynamoDB client:
   * const params = {
   *   TableName: schema.getTableName(),
   *   // ...other parameters
   * };
   */
  getTableName(): string {
    return this.tableName;
  }

  /**
   * Validates that a given object contains the required keys and expected types.
   * @param key - The key object to validate.
   * @throws If required keys are missing or types are incorrect.
   */
  validateKey(key: Record<string, unknown>): void {
    this.validateField(this.partitionKey, key);

    if (this.sortKey) {
      this.validateField(this.sortKey, key);
    }
  }

  /**
   * Internal helper to validate presence and type of a single field.
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

/**
 * Error thrown when a key is invalid according to the schema.
 */
export class InvalidKeyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidKeyError';
  }
}
