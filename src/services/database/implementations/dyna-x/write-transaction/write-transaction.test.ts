import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBClient, TransactWriteItemsCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBTransactionWrite } from './';
import { MaxItemsExceededError } from '../errors/max-item-exceeded-error';
import { WriteUnit } from '../../../contracts/write-transaction';

const ddbMock = mockClient(DynamoDBClient);

const mockSchema = {
  getTableName: () => 'TestTable',
  validateKey: jest.fn(),
};

const defaultItem = { pk: 'id1', sk: 'metadata' };

describe('DynamoDBTransactionWrite', () => {
  let transactionWrite: DynamoDBTransactionWrite;

  beforeEach(() => {
    ddbMock.reset();
    jest.clearAllMocks();
    transactionWrite = new DynamoDBTransactionWrite(); // logger omitted
  });

  it('should send a successful transaction', async () => {
    ddbMock.on(TransactWriteItemsCommand).resolves({});

    const units: WriteUnit<any, any>[] = [
      { container: mockSchema, item: defaultItem },
    ];

    expect(await transactionWrite.write(units)).toBeUndefined();
    await expect(transactionWrite.write(units)).resolves.not.toThrow();
  });

  it('should throw MaxItemsExceededError if batch is too large', async () => {
    const units = Array(101).fill({ container: mockSchema, item: defaultItem });

    await expect(transactionWrite.write(units)).rejects.toThrow(MaxItemsExceededError);
  });

  it('should validate all keys using schema.validateKey', async () => {
    ddbMock.on(TransactWriteItemsCommand).resolves({});
    const spy = jest.fn();

    const schemaWithSpy = {
      ...mockSchema,
      validateKey: spy,
    };

    const units: WriteUnit<any, any>[] = [
      { container: schemaWithSpy, item: defaultItem },
      { container: schemaWithSpy, item: { pk: 'id2', sk: 'meta' } },
    ];

    await transactionWrite.write(units);

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should throw if DynamoDB throws an exception', async () => {
    ddbMock.on(TransactWriteItemsCommand).rejects(new Error('Something went wrong'));

    const units: WriteUnit<any, any>[] = [
      { container: mockSchema, item: defaultItem },
    ];

    await expect(transactionWrite.write(units)).rejects.toThrow('Something went wrong');
  });
});
