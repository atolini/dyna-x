import { IEvent } from '@event/contracts/i-event';

/**
 * @interface EventWrapper
 * @template T - Event type.
 *
 * @description
 * Represents a wrapper object for a event that includes metadata for tracing.
 * This interface is used when dispatching events to external systems, such as AWS EventBridge,
 * to ensure consistent inclusion of contextual information like `requestId`.
 *
 * @property {DomainEvent<object>} event - The event instance to be dispatched. It contains the core event data and metadata (e.g., type, timestamp).
 * @property {string} requestId - A unique identifier associated with the request that triggered this event.
 * This ID can be used for distributed tracing across services.
 * @property {string} userId- Optional user ID associated with the event. This can be useful for tracking which user initiated the event.
 *
 * @example
 * const event: Event = {
 *   event: new UserCreatedEvent({ userId: '123' }),
 *   requestId: 'req-456',
 *   userId: 'user-789'
 * };
 */
export interface EventWrapper {
  event: IEvent;
  requestId: string;
  userId?: string;
}
