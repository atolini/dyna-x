/**
 * Interface for a logging service that supports writing log entries
 * to a given log container (such as a log group or file).
 *
 * @template T - The type representing individual log entries.
 * @template Q - The type representing the log container identifier (e.g., a log group or stream key).
 */
export interface ILogService<T, Q> {
  /**
   * Writes an array of log entries to a specified log container.
   *
   * @param logs - An array of log entries to be written.
   * @param logContainerId - Identifier used to resolve the target log container.
   * @returns A promise that resolves when the log entries have been written.
   */
  putLog(logs: T[], logContainerId: Q): Promise<void>;
}
