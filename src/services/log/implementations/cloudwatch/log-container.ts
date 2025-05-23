/**
 * Represents the identification details required to send logs to a specific
 * destination in AWS CloudWatch Logs.
 *
 * This container is used to define the target log group and log stream where
 * the logs will be written.
 *
 * @property logGroupName - The name of the log group in CloudWatch Logs.
 * @property logStreamName - The name of the log stream within the log group.
 *
 * @example
 * const logContainer: LogContainer = {
 *   logGroupName: 'application-logs',
 *   logStreamName: 'auth-service-stream',
 * };
 */
export type LogContainer = {
  logGroupName: string;
  logStreamName: string;
};
