/**
 * @class DomainEvent
 *
 * @classdesc
 * Base class for all domain events.
 * Provides a creation timestamp.
 */
export abstract class DomainEvent {
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
}
