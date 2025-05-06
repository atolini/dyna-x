/**
 * Represents a generic unit of data to be written to a specific container.
 */
export interface WriteUnit<Container, Item> {
  /**
   * Identifier of the target container (e.g., table name, collection, etc.).
   */
  container: Container;

  /**
   * The actual data item to be written.
   */
  item: Item;
}

/**
 * Represents an abstract interface for performing batched write-only transactions
 * targeting specific containers.
 */
export interface IWriteTransaction<Container, Item> {
  /**
   * Persists a batch of items into their respective containers.
   *
   * @param units - An array of write units containing the container and item.
   * @returns A promise that resolves when the write operation is complete.
   */
  write(units: WriteUnit<Container, Item>[]): Promise<void>;
}
