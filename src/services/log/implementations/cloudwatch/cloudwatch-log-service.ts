import {
  CloudWatchLogsClient,
  DescribeLogStreamsCommand,
  PutLogEventsCommand,
} from '@aws-sdk/client-cloudwatch-logs';
import { ILogService } from '@log/contracts';

export interface LogContainer {
  logGroupName: string;
  logStreamName: string;
}

/**
 * @implements {ILogService}
 * @template T - The type of individual log entries.
 *
 * AWS CloudWatch implementation of the ILogService interface for sending logs.
 *
 * This service uses Amazon CloudWatch Logs to push application logs into a specified log group and stream.
 * It supports sending an array of logs in either string or object format. Each log entry is timestamped upon submission.
 * The service resolves the required sequence token before sending logs to ensure correct ordering.
 *
 * @example
 * // Example 1: Create a CloudWatch log service and send plain text logs
 * const logService = new CloudWatchLogService('us-east-1');
 *
 * const logs = ['Log message 1', 'Log message 2'];
 * const logContainer = {
 *   logGroupName: 'my-log-group',
 *   logStreamName: 'my-log-stream',
 * };
 *
 * await logService.putLog(logs, logContainer);
 *
 * @example
 * // Example 2: Send logs as JSON objects
 * const logs = [{ event: 'USER_LOGIN', userId: 123 }, { event: 'USER_LOGOUT', userId: 123 }];
 *
 * await logService.putLog(logs, {
 *   logGroupName: 'app-events',
 *   logStreamName: 'user-activity',
 * });
 */
export class CloudWatchLogService<T> implements ILogService<T, LogContainer> {
  private readonly client: CloudWatchLogsClient;

  /**
   * Constructs a new instance of CloudWatchLogService.
   *
   * @param {string} [region] - AWS region for the CloudWatchLogs client (default: 'us-east-1').
   */
  constructor(region?: string) {
    this.client = new CloudWatchLogsClient(region ? { region } : {});
  }

  /**
   * Sends an array of logs to the specified CloudWatch Logs destination.
   *
   * @param logs - Array of log entries to be sent.
   * @param logContainerId - Identifier used to determine the log group and log stream names.
   * @returns {Promise<void>} A promise that resolves once the logs are sent.
   *
   * @throws {DataAlreadyAcceptedException} If the logs are already accepted.
   * @throws {InvalidParameterException} If the parameters are invalid.
   * @throws {InvalidSequenceTokenException} If the sequence token is invalid.
   * @throws {ResourceNotFoundException} If the specified log group or log stream does not exist.
   * @throws {ServiceUnavailableException} If the service is unavailable.
   * @throws {UnrecognizedClientException} If the client is unrecognized.
   *
   * This function uses the AWS SDK commands:
   * - `DescribeLogStreamsCommand` to retrieve the log stream details and sequence token.
   * - {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/cloudwatch-logs/command/PutLogEventsCommand/ | PutLogEventsCommand} to send the logs.
   */
  async putLog(logs: T[], logContainerId: LogContainer): Promise<void> {
    const { logGroupName, logStreamName } = logContainerId;

    // Get sequence token
    const describeRes = await this.client.send(
      new DescribeLogStreamsCommand({
        logGroupName,
        logStreamNamePrefix: logStreamName,
      }),
    );

    const logStream = describeRes.logStreams?.find(
      (stream) => stream.logStreamName === logStreamName,
    );

    const sequenceToken = logStream?.uploadSequenceToken;

    // Format logs
    const logEvents = logs.map((log) => ({
      message: typeof log === 'string' ? log : JSON.stringify(log),
      timestamp: Date.now(),
    }));

    // Send logs
    await this.client.send(
      new PutLogEventsCommand({
        logEvents,
        logGroupName,
        logStreamName,
        sequenceToken,
      }),
    );
  }
}
