/**
 * @interface IEvent
 * @template T - The shape of the event payload.
 *
 * @description
 * Represents a generic event structure with creation timestamp, type identification,
 * and payload serialization.
 */
export interface IEvent<T> {
  /**
   * Returns the timestamp when the event was created.
   *
   * @returns {Date} The creation timestamp of the event.
   */
  getCreatedAt(): Date;

  /**
   * Returns a plain object representing the event's payload.
   *
   * @returns {T} The serialized payload of the event.
   */
  getEvent(): T;

  /**
   * Returns the type or name of the event.
   *
   * @returns {string} The name/type of the event.
   */
  getType(): string;
}
