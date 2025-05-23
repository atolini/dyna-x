/**
 * @template E - The type of event to be dispatched.
 *
 * Contract for dispatching events within a system.
 *
 * This interface abstracts the mechanism of event dispatching, allowing implementations for different transport
 * mechanisms such as in-memory event buses, message queues, or cloud event systems like AWS EventBridge.
 */
export interface IEventDispatcherService<E> {
  /**
   * Publishes a single event.
   *
   * @param params - The event instance to publish.
   */
  publish(params: E): Promise<void>;

  /**
   * Publishes multiple events.
   *
   * @param params - An array of event instances to publish.
   */
  publishAll(params: E[]): Promise<void>;
}
