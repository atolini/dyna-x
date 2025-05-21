import { IEventDispatcherServiceEventLogger } from '@event-dispatcher/contracts/i-event-dispatcher-service-event-logger';
import { ILogger } from '@logger/contracts';
import { EventWrapper } from './event-wrapper';

/**
 * @class EventBridgeServiceEventLogger
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
 * const eventLogger = new EventBridgeServiceEventLogger(logger, 'my-event-bus');
 * eventLogger.eventPublished({ event: new UserCreatedEvent(...), requestId: 'abc-123' });
 */
export class EventBridgeServiceEventLogger
  implements IEventDispatcherServiceEventLogger<EventWrapper>
{
  /**
   * Constructs a new EventBridgeServiceEventLogger.
   *
   * @param eventBusName - The name of the EventBridge bus where events are published.
   */
  constructor(private readonly logger: ILogger<any>) {}

  /**
   * Logs a single event dispatch.
   *
   * @param event - The event metadata and domain event instance.
   */
  public eventPublished(event: EventWrapper, transport: string): void {
    const { requestId, userId, event: domainEvent } = event;
    this.logger.info({
      message: 'Domain Event Published',
      eventBusName: transport,
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
  public batchEventsPublished(events: EventWrapper[], transport: string): void {
    events.forEach((event) => this.eventPublished(event, transport));
  }
}
