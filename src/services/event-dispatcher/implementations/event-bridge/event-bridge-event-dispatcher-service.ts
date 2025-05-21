import {
  EventBridgeClient,
  PutEventsCommand,
  PutEventsRequestEntry,
} from '@aws-sdk/client-eventbridge';
import { IEventDispatcherService } from '@event-dispatcher/contracts/i-event-dispatcher-service';
import { IEventDispatcherServiceEventLogger } from '@event-dispatcher/contracts/i-event-dispatcher-service-event-logger';
import { EventWrapper } from './event-wrapper';

/**
 * @class EventBridgeServiceEventDispatcher
 * @implements {IEventDispatcherService<EventWrapper>}
 *
 * @classdesc
 * Implementation of IDomainEventDispatcher that sends domain events to AWS EventBridge.
 *
 * This class provides methods to publish single or multiple domain events to an EventBridge event bus.
 * It converts domain events into EventBridge entries and sends them using the AWS SDK.
 *
 * To create an instance of this class, you need to provide the event bus name, service name, and optionally the AWS region.
 *
 * Each `Event` object sent to this class contains a `DomainEvent` instance and a `requestId`.
 * The `requestId` is a unique identifier for the request and is included in the event payload
 * to enable tracking across distributed systems (e.g., multiple Lambda functions or services).
 *
 * @example
 * const bus = new EventBridgeDomainEventDispatcher('my-event-bus', 'my-service', 'us-east-1');
 * const event = new UserCreatedEvent({ userId: '123', email: 'user@example.com' });
 * await bus.publish({ event, requestId: 'abc-123' });
 */
export class EventBridgeDomainEventDispatcher
  implements IEventDispatcherService<EventWrapper>
{
  private readonly client: EventBridgeClient;

  /**
   *
   */
  constructor(
    private readonly eventBusName: string,
    private readonly service: string,
    private readonly eventLogger: IEventDispatcherServiceEventLogger<EventWrapper>,
    region?: string,
  ) {
    this.client = new EventBridgeClient(region ? { region } : {});
  }

  /**
   * Publishes a single domain event to AWS EventBridge.
   *
   * @param {IEvent<any>} event - Object containing the domain event instance and a unique requestId for tracing.
   * @returns {Promise<void>} A promise that resolves when the event has been successfully published.
   *
   * @throws {InternalException} Throws if there is an error on the EventBridge service side.
   *
   * This function uses the AWS SDK command:
   * - {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/eventbridge/command/PutEventsCommand/ | PutEventsCommand} for more details.
   */
  public async publish(event: EventWrapper): Promise<void> {
    const entry = this.toEventBridgeEntry(event);
    await this.sendCommand([entry]);
    this.eventLogger.eventPublished(event, this.eventBusName);
  }

  /**
   * Publishes multiple domain events to AWS EventBridge in a single batch request.
   *
   * @param {IEvent<any>[]} events - Array of objects each containing a domain event instance and a requestId.
   * @returns {Promise<void>} A promise that resolves when all events have been successfully published.
   *
   * @throws {InternalException} Throws if there is an error on the EventBridge service side.
   *
   * This function uses the AWS SDK command:
   * - {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/eventbridge/command/PutEventsCommand/ | PutEventsCommand} for more details.
   */
  public async publishAll(events: EventWrapper[]): Promise<void> {
    const entries = events.map((event) => this.toEventBridgeEntry(event));
    await this.sendCommand(entries);
    this.eventLogger.batchEventsPublished(events, this.eventBusName);
  }

  /**
   * Sends a PutEventsCommand to EventBridge with the given entries.
   *
   * @private
   * @param {PutEventsRequestEntry[]} entries - The list of entries to send.
   * @returns {Promise<void>} A promise that resolves once the command is sent.
   */
  private async sendCommand(entries: PutEventsRequestEntry[]): Promise<void> {
    const command = new PutEventsCommand({ Entries: entries });
    await this.client.send(command);
  }

  /**
   * Converts a domain event into an EventBridge entry.
   *
   * @private
   * @param {IEvent<any>} event - The domain event to convert.
   * @returns {PutEventsRequestEntry} The EventBridge entry.
   */
  private toEventBridgeEntry(event: EventWrapper): PutEventsRequestEntry {
    const e = event.event;
    const eventType = e.getType();
    const eventDetail = e.getEvent();
    const eventDate = e.getCreatedAt();
    const requestId = event.requestId;
    const userId = event.userId ? event.userId : undefined;

    return {
      EventBusName: this.eventBusName,
      Source: this.service,
      DetailType: eventType,
      Time: eventDate,
      Detail: JSON.stringify({ ...eventDetail, requestId, userId }),
    };
  }
}
