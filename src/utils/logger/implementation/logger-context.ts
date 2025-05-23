/**
 * Contextual metadata to be included in every log entry.
 * Helps trace logs across distributed systems by providing consistent identifiers.
 *
 * @property {string} requestId - Unique identifier for the current request or operation.
 * @property {string} service - Name of the service or component generating the log.
 * @property {string} [userId] - Optional identifier of the user associated with the request.
 *
 * @example
 * const context: LoggerContext = {
 *   requestId: 'req-456',
 *   service: 'OrderService',
 *   userId: 'user-123'
 * };
 */
export type LoggerContext = {
  requestId: string;
  service: string;
  userId?: string;
}
