import { ILogger } from '../contracts';

/**
 * A simple, structured logger implementation that outputs JSON logs to the console.
 *
 * Designed to work seamlessly with AWS CloudWatch Logs and metric filters.
 * Automatically includes a flat base context for all log entries and supports
 * logging either strings or flat objects.
 *
 * @template T - The shape of the base context that will be included in all log messages.
 */
export class Logger<T extends Record<string, string>> implements ILogger<T> {
  private readonly baseContext: Record<string, string>;

  /**
   * Creates a new instance of the Logger with a fixed context.
   * The context is merged into every log entry as top-level keys.
   *
   * @param contextItem - A flat object containing static context information (e.g., service name, request ID).
   */
  constructor(contextItem: T) {
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
      ...(typeof item === 'string' ? { message: item } : item),
    };

    console.log(JSON.stringify(logEntry));
  }
}
