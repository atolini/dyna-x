import { DynamoSchema } from './dynamo-schema';
import { InvalidKeyError } from './invalid-key-error';
import { KeyConfig } from './key-config';

describe('DynamoSchema', () => {
  const partitionKey: KeyConfig = { name: 'userId', type: 'string' };
  const sortKey: KeyConfig = { name: 'createdAt', type: 'number' };

  describe('getTableName', () => {
    it('should return the table name', () => {
      // arrange
      const schema = new DynamoSchema('UsersTable', partitionKey);

      // act
      const result = schema.getTableName();

      // assert
      expect(result).toBe('UsersTable');
    });
  });

  describe('validateKey', () => {
    it('should not throw when valid key is provided (partition key only)', () => {
      // arrange
      const schema = new DynamoSchema('UsersTable', partitionKey);
      const key = { userId: 'abc123' };

      // act & assert
      expect(() => schema.validateKey(key)).not.toThrow();
    });

    it('should not throw when valid key is provided (partition + sort key)', () => {
      // arrange
      const schema = new DynamoSchema('UsersTable', partitionKey, sortKey);
      const key = { userId: 'abc123', createdAt: 1692451820 };

      // act & assert
      expect(() => schema.validateKey(key)).not.toThrow();
    });

    it('should throw InvalidKeyError if partition key is missing', () => {
      // arrange
      const schema = new DynamoSchema('UsersTable', partitionKey, sortKey);
      const key = { createdAt: 1692451820 };

      // act & assert
      expect(() => schema.validateKey(key)).toThrow(InvalidKeyError);
      expect(() => schema.validateKey(key)).toThrow(
        'Missing required key: userId',
      );
    });

    it('should throw InvalidKeyError if sort key is missing', () => {
      // arrange
      const schema = new DynamoSchema('UsersTable', partitionKey, sortKey);
      const key = { userId: 'abc123' };

      // act & assert
      expect(() => schema.validateKey(key)).toThrow(InvalidKeyError);
      expect(() => schema.validateKey(key)).toThrow(
        'Missing required key: createdAt',
      );
    });

    it('should throw InvalidKeyError if partition key has wrong type', () => {
      // arrange
      const schema = new DynamoSchema('UsersTable', partitionKey, sortKey);
      const key = { userId: 123, createdAt: 1692451820 };

      // act & assert
      expect(() => schema.validateKey(key)).toThrow(InvalidKeyError);
      expect(() => schema.validateKey(key)).toThrow(
        'Invalid type for key "userId". Expected "string", got "number".',
      );
    });

    it('should throw InvalidKeyError if sort key has wrong type', () => {
      // arrange
      const schema = new DynamoSchema('UsersTable', partitionKey, sortKey);
      const key = { userId: 'abc123', createdAt: 'invalid' };

      // act & assert
      expect(() => schema.validateKey(key)).toThrow(InvalidKeyError);
      expect(() => schema.validateKey(key)).toThrow(
        'Invalid type for key "createdAt". Expected "number", got "string".',
      );
    });
  });
});
