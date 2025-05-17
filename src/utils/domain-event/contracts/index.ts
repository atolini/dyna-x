/**
 * @interface IDomainEvent
 *
 * Interface for domain events.
 *
 * Represents the structure and behavior that all domain events must follow,
 * including retrieving the creation timestamp and returning the typed event instance.
 */
export interface IDomainEvent<T> {
  /**
   * Returns the timestamp when the event was created.
   */
  getCreatedAt(): Date;

  /**
   * Returns the current event instance typed as T.
   */
  getEvent(): T;
}
