/**
 * @interface IDomainEventDispatcher
 * @template E - The type of the domain event to be dispatched.
 *
 * @description
 * Contract for dispatching domain events within a system.
 *
 * In the context of Domain-Driven Design (DDD), a domain event dispatcher is responsible
 * for publishing domain events to external systems or internal subscribers. This interface
 * abstracts the mechanism of dispatching, allowing implementations for different transport
 * mechanisms such as in-memory event buses, message queues, or cloud event systems
 * like AWS EventBridge.
 */
export interface IDomainEventDispatcher<E> {
  /**
   * Publishes a single domain event.
   *
   * @param params - The domain event instance to publish.
   */
  publish(params: E): Promise<void>;

  /**
   * Publishes multiple domain events.
   *
   * @param params - An array of domain event instances to publish.
   */
  publishAll(params: E[]): Promise<void>;
}
