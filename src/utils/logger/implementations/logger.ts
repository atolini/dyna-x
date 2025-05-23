import { ILogger } from '@logger/contracts';
import { LoggerContext } from '.';

/**
 * @implements {ILogger<LoggerContext>}
 *
 * Structured logger for JSON-based logging, optimized for AWS CloudWatch.
 *
 * Automatically includes contextual metadata (e.g., requestId, service name, userId)
 * in each log entry to enable traceability across distributed systems.
 *
 * Supports `info`, `warn`, and `error` levels. Accepts string messages or flat objects
 * and emits logs as single-line JSON strings for easy parsing and searchability.
 *
 * @example
 * const logger = new Logger({
 *   requestId: 'abc-123',
 *   service: 'UserService',
 *   userId: 'user-789'
 * });
 *
 * logger.info('User created successfully');
 * logger.warn({ action: 'validateInput', warning: 'Missing optional field' });
 * logger.error({ errorCode: 'USER_CREATION_FAILED', reason: 'Email already in use' });
 */
export class Logger implements ILogger<LoggerContext> {
  private readonly baseContext: Record<string, string>;

  /**
   * Creates a new instance of the Logger with a fixed context.
   * The context is merged into every log entry as top-level keys.
   *
   * @param contextItem - A flat object containing static context information (e.g., service name, request ID, user ID).
   */
  constructor(contextItem: LoggerContext) {
    this.baseContext = { ...contextItem };
  }

  /**
   * Logs a warning-level message.
   *
   * @param item - A string message or a flat object containing warning data.
   */
  warn(item: object | string): void {
    this.log('warn', item);
  }

  /**
   * Logs an error-level message.
   *
   * @param item - A string message or a flat object containing error data.
   */
  error(item: object | string): void {
    this.log('error', item);
  }

  /**
   * Logs an informational-level message.
   *
   * @param item - A string message or a flat object containing informational data.
   */
  info(item: object | string): void {
    this.log('info', item);
  }

  /**
   * Internal method to output a structured log entry to the console.
   * Automatically includes the log level, timestamp, and base context.
   *
   * @param level - The severity level of the log ('info', 'warn', or 'error').
   * @param item - A string message or a flat object with additional log details.
   */
  private log(level: 'info' | 'warn' | 'error', item: object | string): void {
    const logEntry = {
      level,
      timestamp: new Date().toISOString(),
      ...this.baseContext,
      ...(typeof item === 'string' ? { message: item } : { details: item }),
    };

    console.log(JSON.stringify(logEntry));
  }
}
