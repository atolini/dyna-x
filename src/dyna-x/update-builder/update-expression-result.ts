export type UpdateExpressionResult = {
    /**
     * The complete update expression string combining all operations
     * @example "SET #name = :value REMOVE #age"
     */
    UpdateExpression: string;

    /**
     * Mapping of expression attribute name placeholders to actual field names
     * @example { "#name": "username", "#age": "user_age" }
     */
    ExpressionAttributeNames: Record<string, string>;

    /**
     * Mapping of expression value placeholders to their corresponding values
     * @example { ":value": { S: "john_doe" } }
     */
    ExpressionAttributeValues: Record<string, any>;
};