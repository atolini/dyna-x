/**
 * @template E - The type representing the event payload.
 *
 * Interface for logging to the console the events that occur during the use of an IEventDispatcherService implementation.
 * Intended for simple logging of event publishing actions, both for single and batch events, mainly for debugging or development purposes.
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
