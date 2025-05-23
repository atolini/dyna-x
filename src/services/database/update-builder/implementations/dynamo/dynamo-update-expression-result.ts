/**
 *
 * Structure returned by an UpdateBuilder or similar utility after generating a DynamoDB update expression.
 * This object is used to safely construct update operations for DynamoDB by separating the expression
 * from its attribute names and values, preventing issues with reserved words and injection.
 *
 * @property {string} UpdateExpression - The complete update expression string combining all operations.
 * For example, it may include `SET`, `REMOVE`, `ADD`, or `DELETE` clauses.
 * @example "SET #name = :value REMOVE #age"
 *
 * @property {Record<string, string>} ExpressionAttributeNames - A mapping of expression attribute name placeholders
 * to actual attribute names. This ensures attribute names are safely referenced in the expression.
 * @example { "#name": "username", "#age": "user_age" }
 *
 * @property {Record<string, any>} ExpressionAttributeValues - A mapping of expression value placeholders
 * to their corresponding values, formatted for DynamoDB.
 * @example { ":value": { S: "john_doe" } }
 */
export type DynamoUpdateExpressionResult = {
  /** The complete update expression string combining all operations. For example, it may include `SET`, `REMOVE`, `ADD`, or `DELETE` clauses.  */
  UpdateExpression: string;

  /** A mapping of expression attribute name placeholders to actual attribute names. This ensures attribute names are safely referenced in the expression. */
  ExpressionAttributeNames: Record<string, string>;

  /** A mapping of expression value placeholders to their corresponding values, formatted for DynamoDB. */
  ExpressionAttributeValues: Record<string, any>;
};
