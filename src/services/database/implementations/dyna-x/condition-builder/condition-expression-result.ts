export type ConditionExpressionResult<V = any> = {
  /**
   * The combined condition expression string
   */
  ConditionExpression: string;

  /**
   * Object mapping expression placeholders to attribute names
   */
  ExpressionAttributeNames: Record<string, string>;

  /**
   * Object mapping value placeholders to their typed values
   */
  ExpressionAttributeValues: Record<string, V>;
};
