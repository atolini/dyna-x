/**
 * @interface IEventDispatcherEventLogger
 * @template E - The type representing the event payload and metadata.
 *
 * @description
 * Interface for logging events. Supports logging individual or multiple events
 * along with relevant metadata for observability and traceability.
 */
export interface IEventDispatcherEventLogger<E> {
  /**
   * Logs a single event.
   *
   * @param event - The event instance to be logged.
   */
  eventPublished(event: E): void;

  /**
   * Logs multiple events.
   *
   * @param events - An array of event instances to be logged.
   */
  batchEventsPublished(events: E[]): void;
}
