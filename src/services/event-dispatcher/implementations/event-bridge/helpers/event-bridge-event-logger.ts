import { ILogger } from '../../../../../utils/logger/contracts';
import { Event } from '../index';

/**
 * @class EventBridgeEventLogger
 * @classdesc
 * Helper class responsible for logging domain events dispatched via {@link EventBridgeDomainEventDispatcher}.
 *
 * It provides structured logs of single or batch event dispatches including metadata
 * such as requestId, userId, event type and timestamp.
 *
 * This class enhances observability and supports tracing and auditing of event-driven workflows.
 *
 * @example
 * const logger = new Logger<Context>({...}); // implements ILogger
 * const eventLogger = new EventBridgeEventLogger(logger, 'my-event-bus');
 * eventLogger.eventPublished({ event: new UserCreatedEvent(...), requestId: 'abc-123' });
 */
export class EventBridgeEventLogger {
  private readonly logger: ILogger<unknown>;
  private readonly eventBusName: string;

  /**
   * Constructs a new EventBridgeEventLogger.
   *
   * @param logger - A logger instance that implements the ILogger interface.
   * @param eventBusName - The name of the EventBridge bus where events are published.
   */
  constructor(logger: ILogger<unknown>, eventBusName: string) {
    this.logger = logger;
    this.eventBusName = eventBusName;
  }

  /**
   * Logs a single event dispatch.
   *
   * @param event - The event metadata and domain event instance.
   */
  public eventPublished(event: Event): void {
    const { requestId, userId, event: domainEvent } = event;
    this.logger.info({
      message: 'Domain Event Published',
      eventBusName: this.eventBusName,
      eventType: domainEvent.getType(),
      timestamp: domainEvent.getCreatedAt().toISOString(),
      payload: domainEvent.getEvent(),
      requestId,
      userId,
    });
  }

  /**
   * Logs multiple event dispatches.
   *
   * @param events - An array of event metadata and domain event instances.
   */
  public batchEventsPublished(events: Event[]): void {
    events.forEach((event) => this.eventPublished(event));
  }
}
