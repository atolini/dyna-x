/**
 * @class DomainEvent
 *
 * @classdesc
 * Base class for all domain events.
 *
 * In the context of Domain-Driven Design (DDD), domain events represent something
 * that has happened in the domain that you want other parts of the system to be aware of.
 * This abstract class provides a consistent structure for domain events by including
 * a timestamp of when the event was created, a method to retrieve the typed event object,
 * and a method to identify the type of event.
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
 * console.log(event.getType());     // Outputs 'UserCreatedEvent'
 * console.log(event.getEvent());     // Outputs { userId: '123', email: 'user@example.com' }
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
   * Returns a plain object representation of the current event,
   * containing all its own enumerable properties.
   * Useful for sending or logging event data in a transport-safe format.
   */
  public getEvent(): T {
    const entries = Object.entries(this) as [keyof T, any][];
    return entries.reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as T);
  }

  /**
   * Returns the type of the event, which is the name of the class.
   * This can be useful for event routing or logging.
   */
  public getType(): string {
    return this.constructor.name;
  }
}
