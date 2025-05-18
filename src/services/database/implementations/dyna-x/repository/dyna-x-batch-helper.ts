import {
  AttributeValue,
  BatchWriteItemCommand,
  BatchWriteItemCommandInput,
  DynamoDBClient,
  WriteRequest,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import * as _ from 'lodash';
import { UnprocessedItems } from './write-repository';
import { Key } from './key';

export class DynaXBatchHelper<T> {
  private client: DynamoDBClient;
  private tableName: string;

  constructor(client: DynamoDBClient, tableName: string) {
    this.client = client;
    this.tableName = tableName;
  }

  /**
   * Builds batch write requests from items and keys.
   */
  buildBatchRequests(putItems: T[], deleteKeys: Key[] = []): WriteRequest[] {
    const putRequests = putItems.map((item) => ({
      PutRequest: {
        Item: marshall(item) as Record<string, AttributeValue>,
      },
    }));

    const deleteRequests = deleteKeys.map((key) => ({
      DeleteRequest: {
        Key: marshall(key) as Record<string, AttributeValue>,
      },
    }));

    return [...putRequests, ...deleteRequests];
  }

  /**
   * Executes batches of write requests and returns any unprocessed items.
   */
  async executeBatches(
    batches: WriteRequest[][],
  ): Promise<UnprocessedItems<T>> {
    const unprocessedItems: Array<{ type: 'put' | 'delete'; item: T | Key }> =
      [];

    await Promise.all(
      batches.map(async (batch) => {
        const params: BatchWriteItemCommandInput = {
          RequestItems: { [this.tableName]: batch },
        };

        const response = await this.client.send(
          new BatchWriteItemCommand(params),
        );

        if (response.UnprocessedItems?.[this.tableName]) {
          const humanReadable = this.extractUnprocessedItems(
            response.UnprocessedItems[this.tableName],
          );
          unprocessedItems.push(...humanReadable);
        }
      }),
    );

    return unprocessedItems;
  }

  /**
   * Converts unprocessed WriteRequests into human-readable items.
   */
  extractUnprocessedItems(
    unprocessed: WriteRequest[],
  ): UnprocessedItems<T> {
    return unprocessed.map((request) => {
      if (request.PutRequest) {
        return {
          type: 'put',
          item: unmarshall(request.PutRequest.Item!) as T,
        };
      } else {
        return {
          type: 'delete',
          item: unmarshall(request.DeleteRequest!.Key!) as Key,
        };
      }
    });
  }

  /**
   * Utility to chunk WriteRequests into max 25-item batches.
   */
  chunkRequests(requests: WriteRequest[], chunkSize = 25): WriteRequest[][] {
    return _.chunk(requests, chunkSize);
  }
}
