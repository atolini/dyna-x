/**
 * Represents the schema definition for a DynamoDB table, including table name configuration.
 * This class serves as the base for defining DynamoDB table structures and ensures proper key validation.
 *
 * @class DynaXSchema
 *
 * @example
 * // Basic usage:
 * const schema = new DynaXSchema({
 *   tableName: 'UsersTable'
 * });
 * console.log(schema.getTableName()); // 'UsersTable'
 */
export declare class DynaXSchema {
    private tableName;
    /**
     * Creates an instance of DynaXSchema.
     * @constructor
     * @param {object} data - Configuration object for the schema
     * @param {string} data.tableName - The name of the DynamoDB table
     */
    constructor(data: {
        tableName: string;
    });
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
    getTableName(): string;
}
//# sourceMappingURL=dyna-x-schema.d.ts.map