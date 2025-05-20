import {
  EventBridgeClient,
  PutEventsCommand,
  PutEventsRequestEntry,
} from '@aws-sdk/client-eventbridge';
import { DomainEvent } from '../../../../utils/domain-event/implementations';
import { IDomainEventDispatcher } from '../../contracts';
import { ILogger } from '../../../logger/contracts';
import { EventBridgeEventLogger } from './helpers/event-bridge-event-logger';

/**
 * @interface Event
 *
 * @description
 * Represents a wrapper object for a domain event that includes metadata for tracing.
 * This interface is used when dispatching events to external systems, such as AWS EventBridge,
 * to ensure consistent inclusion of contextual information like `requestId`.
 *
 * @property {DomainEvent<object>} event - The domain event instance to be dispatched. It contains the core event data and metadata (e.g., type, timestamp).
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
export interface Event {
  event: DomainEvent<object>;
  requestId: string;
  userId?: string;
}

/**
 * @class EventBridgeDomainEventDispatcher
 * @implements {IDomainEventDispatcher<Event>}
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
  implements IDomainEventDispatcher<Event>
{
  private readonly eventBusName: string;
  private readonly client: EventBridgeClient;
  private readonly service: string;
  private readonly eventsLogger: EventBridgeEventLogger;

  /**
   *
   */
  constructor(
    eventBusName: string,
    service: string,
    logger: ILogger<unknown>,
    region?: string,
  ) {
    this.eventBusName = eventBusName;
    this.service = service;
    this.client = new EventBridgeClient({ region });
    this.eventsLogger = new EventBridgeEventLogger(logger, this.eventBusName);
  }

  /**
   * Publishes a single domain event to AWS EventBridge.
   *
   * @param {Event} event - Object containing the domain event instance and a unique requestId for tracing.
   * @returns {Promise<void>} A promise that resolves when the event has been successfully published.
   *
   * @throws {InternalException} Throws if there is an error on the EventBridge service side.
   *
   * This function uses the AWS SDK command:
   * - {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/eventbridge/command/PutEventsCommand/ | PutEventsCommand} for more details.
   */
  public async publish(event: Event): Promise<void> {
    const entry = this.toEventBridgeEntry(event);
    await this.sendCommand([entry]);
    this.eventsLogger.eventPublished(event);
  }

  /**
   * Publishes multiple domain events to AWS EventBridge in a single batch request.
   *
   * @param {Event[]} events - Array of objects each containing a domain event instance and a requestId.
   * @returns {Promise<void>} A promise that resolves when all events have been successfully published.
   *
   * @throws {InternalException} Throws if there is an error on the EventBridge service side.
   *
   * This function uses the AWS SDK command:
   * - {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/eventbridge/command/PutEventsCommand/ | PutEventsCommand} for more details.
   */
  public async publishAll(events: Event[]): Promise<void> {
    const entries = events.map((event) => this.toEventBridgeEntry(event));
    await this.sendCommand(entries);
    this.eventsLogger.batchEventsPublished(events);
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
   * @param {Event} event - The domain event to convert.
   * @returns {PutEventsRequestEntry} The EventBridge entry.
   */
  private toEventBridgeEntry(event: Event): PutEventsRequestEntry {
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
