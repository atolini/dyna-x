import { DynamoConditionBuilder } from './dynamo-condition-builder';

describe('ConditionBuilder', () => {
  let builder: DynamoConditionBuilder;

  beforeEach(() => {
    builder = new DynamoConditionBuilder();
  });

  describe('eq', () => {
    it('should add an equality condition', () => {
      builder.eq('name', 'John');
      const result = builder.build();

      expect(result.ConditionExpression).toContain('#attr0 = :val0');
      expect(result.ExpressionAttributeNames).toHaveProperty('#attr0', 'name');
      expect(result.ExpressionAttributeValues).toHaveProperty(':val0', {
        S: 'John',
      });
    });
  });

  describe('ne', () => {
    it('should add a not equal condition', () => {
      builder.ne('age', 30);
      const result = builder.build();

      expect(result.ConditionExpression).toContain('#attr0 <> :val0');
      expect(result.ExpressionAttributeNames).toHaveProperty('#attr0', 'age');
      expect(result.ExpressionAttributeValues).toHaveProperty(':val0', {
        N: '30',
      });
    });
  });

  describe('gt', () => {
    it('should add a greater than condition', () => {
      builder.gt('score', 100);
      const result = builder.build();

      expect(result.ConditionExpression).toContain('#attr0 > :val0');
      expect(result.ExpressionAttributeNames).toHaveProperty('#attr0', 'score');
      expect(result.ExpressionAttributeValues).toHaveProperty(':val0', {
        N: '100',
      });
    });
  });

  describe('lt', () => {
    it('should add a less than condition', () => {
      builder.lt('score', 50);
      const result = builder.build();

      expect(result.ConditionExpression).toContain('#attr0 < :val0');
      expect(result.ExpressionAttributeNames).toHaveProperty('#attr0', 'score');
      expect(result.ExpressionAttributeValues).toHaveProperty(':val0', {
        N: '50',
      });
    });
  });

  describe('and', () => {
    it('should add an AND condition', () => {
      builder.eq('status', 'active').and().ne('age', 30);
      const result = builder.build();

      expect(result.ConditionExpression).toContain('AND');
      expect(result.ConditionExpression).toContain('#attr1 <> :val1');
      expect(result.ConditionExpression).toContain('#attr0 = :val0');
    });
  });

  describe('or', () => {
    it('should add an OR condition', () => {
      builder.eq('status', 'active').or().lt('score', 50);
      const result = builder.build();

      expect(result.ConditionExpression).toContain('OR');
      expect(result.ConditionExpression).toContain('#attr1 < :val1');
      expect(result.ConditionExpression).toContain('#attr0 = :val0');
    });
  });

  describe('build', () => {
    it('should return a valid condition expression object', () => {
      builder.eq('name', 'Alice').and().gt('score', 80);
      const result = builder.build();

      expect(result.ConditionExpression).toContain('#attr0 = :val0');
      expect(result.ConditionExpression).toContain('AND');
      expect(result.ConditionExpression).toContain('#attr1 > :val1');
      expect(result.ExpressionAttributeNames).toEqual({
        '#attr0': 'name',
        '#attr1': 'score',
      });
      expect(result.ExpressionAttributeValues).toEqual({
        ':val0': { S: 'Alice' },
        ':val1': { N: '80' },
      });
    });
  });

  describe('formatValue', () => {
    it('should format string values correctly', () => {
      expect(builder['formatValue']('hello')).toEqual({ S: 'hello' });
    });

    it('should format number values correctly', () => {
      expect(builder['formatValue'](42)).toEqual({ N: '42' });
    });

    it('should format boolean values correctly', () => {
      expect(builder['formatValue'](true)).toEqual({ BOOL: true });
    });

    it('should throw an error for unsupported types', () => {
      expect(() => builder['formatValue'](null)).toThrow(
        'Unsupported value type',
      );
      expect(() => builder['formatValue']({})).toThrow(
        'Unsupported value type',
      );
    });
  });
});
