/**
 * @class DomainEvent
 *
 * @classdesc
 * Base class for all domain events.
 *
 * In the context of Domain-Driven Design (DDD), domain events represent something
 * that has happened in the domain that you want other parts of the system to be aware of.
 * This abstract class provides a consistent structure for domain events by including
 * a timestamp of when the event was created and a method to retrieve the typed event.
 *
 * Extend this class to define concrete events that capture meaningful business occurrences.
 *
 * @example
 * interface UserCreatedPayload {
 *   userId: string;
 *   email: string;
 * }
 *
 * class UserCreatedEvent extends DomainEvent<UserCreatedEvent> {
 *   public readonly userId: string;
 *   public readonly email: string;
 *
 *   constructor(payload: UserCreatedPayload) {
 *     super();
 *     this.userId = payload.userId;
 *     this.email = payload.email;
 *   }
 * }
 *
 * const event = new UserCreatedEvent({ userId: '123', email: 'user@example.com' });
 * console.log(event.getCreatedAt()); // Outputs event creation timestamp
 * console.log(event.getEvent());     // Returns typed event instance
 */
export abstract class DomainEvent<T> {
  private readonly createdAt: Date;

  constructor() {
    this.createdAt = new Date();
  }

  /**
   * Returns the timestamp when the event was created.
   */
  public getCreatedAt(): Date {
    return this.createdAt;
  }

  /**
   * Returns the current event instance typed as T.
   * Useful when you want to use the event in a generic event handler or dispatcher.
   */
  public getEvent(): T {
    return this as unknown as T;
  }
}
