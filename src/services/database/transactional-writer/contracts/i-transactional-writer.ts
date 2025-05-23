import { ITransactionalWriterUnit } from '.';

/**
 *
 * @description
 * Represents an abstract contract for performing batched, write-only operations
 * in a transactional manner. Each write targets a specific container (e.g., a table or collection),
 * and the entire batch must be treated atomically — either all writes succeed or none are applied.
 *
 * This interface is useful for implementing data consistency across multiple writes,
 * such as with DynamoDB's `TransactWriteItems` or similar mechanisms in other databases.
 *
 * @template Container - The identifier type for the target container (e.g., table name, collection name).
 * @template Item - The data type of the item to be written.
 */
export interface ITransactionalWriter<Container, Item> {
  /**
   * Persists a batch of items into their respective containers in a single transactional operation.
   *
   * @param units - An array of write units, where each unit contains a container identifier and the item to write.
   * @returns A promise that resolves when the transactional write operation completes successfully,
   *          or rejects if the transaction fails.
   */
  write(units: ITransactionalWriterUnit<Container, Item>[]): Promise<void>;
}
