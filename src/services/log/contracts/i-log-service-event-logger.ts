/**
 * Interface for logging events related to log dispatch operations.
 */
export interface ILogServiceEventLogger {
  /**
   * Logs a successful attempt to dispatch logs.
   *
   * @param logGroupName - The name of the log group.
   * @param logStreamName - The name of the log stream.
   * @param logCount - The number of log entries dispatched.
   */
  logsDispatched(
    logGroupName: string,
    logStreamName: string,
    logCount: number,
  ): void;
}
