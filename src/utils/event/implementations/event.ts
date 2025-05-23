import { IEvent } from '@event/contracts';

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
 * class UserCreatedEvent extends DomainEvent {
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
 * console.log(event.getType());      // Outputs 'UserCreatedEvent'
 * console.log(event.getEvent());     // Outputs { userId: '123', email: 'user@example.com' }
 */
export abstract class DomainEvent implements IEvent {
  private readonly createdAt: Date;

  /**
   * Constructs a new DomainEvent instance and sets the creation timestamp.
   */
  constructor() {
    this.createdAt = new Date();
  }

  /**
   * Returns the timestamp of when the event was created.
   *
   * @returns {Date} The creation time of the event.
   */
  public getCreatedAt(): Date {
    return this.createdAt;
  }

  /**
   * Returns a plain object representation of the current event,
   * including all its own enumerable properties.
   *
   * This method is useful for serializing or logging the event
   * in a format suitable for transport or storage.
   *
   * @returns {object} A plain object representation of the event.
   */
  public getEvent(): object {
    return JSON.parse(JSON.stringify(this));
  }

  /**
   * Returns the name of the class that instantiated the event.
   *
   * This can be used for identifying the type of event during event dispatching,
   * logging, or when routing events to handlers.
   *
   * @returns {string} The type (class name) of the event.
   */
  public getType(): string {
    return this.constructor.name;
  }
}
