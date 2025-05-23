/**
 * Represents a generic unit of data to be written transactionally to a specific container.
 * This interface is typically used in the context of transactional write operations,
 * such as DynamoDB's `TransactWriteItems`, allowing the grouping of multiple writes
 * that must succeed or fail together.
 *
 * @template Container - The type used to identify the target container (e.g., table name or collection).
 * @template Item - The type of the item being written to the container.
 *
 * @property {Container} container - Identifier of the target container (e.g., table name, collection name).
 * @property {Item} item - The actual data item to be written to the container.
 */
export interface ITransactionalWriterUnit<Container, Item> {
  container: Container;
  item: Item;
}
