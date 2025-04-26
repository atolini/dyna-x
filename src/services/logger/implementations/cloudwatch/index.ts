import {
    CloudWatchLogsClient,
    DescribeLogStreamsCommand,
    PutLogEventsCommand
} from '@aws-sdk/client-cloudwatch-logs';
import { ILogService } from '../../contracts';

export interface LogContainer {
    logGroupName: string;
    logStreamName: string;
}

/**
 * Service responsible for writing log entries to AWS CloudWatch Logs.
 * 
 * @template T - The type of individual log entries.
 * @template Q - The type representing the log container ID (used to resolve group and stream).
 */
export class CloudWatchLogService<T> implements ILogService<T, LogContainer> {
    private client: CloudWatchLogsClient;

    /**
     * Constructs a new instance of CloudWatchLogService.
     * 
     * @param region - AWS region for the CloudWatchLogs client (default: 'us-east-1').
     */
    constructor(region = 'us-east-1') {
        this.client = new CloudWatchLogsClient({ region });
    }

    /**
     * Sends an array of logs to the specified CloudWatch Logs destination.
     * 
     * @param logs - Array of log entries to be sent.
     * @param logContainerId - Identifier used to determine the log group and log stream names.
     */
    async putLog(logs: T[], logContainerId: LogContainer): Promise<void> {
        const { logGroupName, logStreamName } = logContainerId;

        // Get sequence token
        const describeRes = await this.client.send(
            new DescribeLogStreamsCommand({
                logGroupName,
                logStreamNamePrefix: logStreamName,
            })
        );

        const logStream = describeRes.logStreams?.find(
            stream => stream.logStreamName === logStreamName
        );

        const sequenceToken = logStream?.uploadSequenceToken;

        // Format logs
        const logEvents = logs.map(log => ({
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
            })
        );
    }
}
