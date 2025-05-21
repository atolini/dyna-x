/**
 * @interface IEventDispatcherEventLogger
 * @template E - The type representing the event payload and metadata.
 *
 * @description
 * Interface for logging events. Supports logging individual or multiple events
 * along with relevant metadata for observability and traceability.
 */
export interface IEventDispatcherServiceEventLogger<E> {
  /**
   * Logs a single event.
   *
   * @param event - The event instance to be logged.
   * @param transport - The name or identifier of the transport used to dispatch the event
   *                    (e.g., 'sns', 'kafka', 'rabbitmq').
   */
  eventPublished(event: E, transport: string): void;

  /**
   * Logs multiple events.
   *
   * @param events - An array of event instances to be logged.
   * @param transport - The name or identifier of the transport used to dispatch the events
   *                    (e.g., 'sns', 'kafka', 'rabbitmq').
   */
  batchEventsPublished(events: E[], transport: string): void;
}
