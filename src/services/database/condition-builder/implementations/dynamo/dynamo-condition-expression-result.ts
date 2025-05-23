import { AttributeValue } from '@aws-sdk/client-dynamodb';

/**
 *
 * @description
 * Result structure returned by the DynamoConditionBuilder after building the condition expression.
 * This object is used in DynamoDB operations (e.g., UpdateItem, DeleteItem)
 * that require conditional expressions.
 *
 * @property {string} ConditionExpression - The complete condition expression string,
 * combining all conditions and logical operators.
 *
 * @property {Record<string, string>} ExpressionAttributeNames - A mapping between
 * placeholder names and actual attribute names. Used to safely reference attributes
 * in DynamoDB queries and avoid reserved keyword conflicts.
 *
 * @property {Record<string, AttributeValue>} ExpressionAttributeValues - A mapping
 * between placeholder names and their corresponding values, properly formatted
 * for DynamoDB. These values are used to evaluate the condition expression.
 */
export type DynamoConditionExpressionResult = {
  /** The complete condition expression string, combining all conditions and logical operators. */
  ConditionExpression: string;

  /** A mapping between placeholder names and actual attribute names. Used to safely reference attributes in DynamoDB queries and avoid reserved keyword conflicts. */
  ExpressionAttributeNames: Record<string, string>;

  /** A mapping between placeholder names and their corresponding values, properly formatted for DynamoDB. These values are used to evaluate the condition expression. */
  ExpressionAttributeValues: Record<string, AttributeValue>;
};
