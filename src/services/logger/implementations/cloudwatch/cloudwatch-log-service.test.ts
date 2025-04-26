import { mockClient } from 'aws-sdk-client-mock';
import {
    CloudWatchLogsClient,
    DescribeLogStreamsCommand,
    PutLogEventsCommand,
} from '@aws-sdk/client-cloudwatch-logs';
import { CloudWatchLogService } from '.';
import { ILogService } from '../../contracts';

interface LogContainer {
    logGroupName: string;
    logStreamName: string;
}

describe('CloudWatchLogService', () => {
    const cloudwatchMock = mockClient(CloudWatchLogsClient);
    const logGroupName = 'test-group';
    const logStreamName = 'test-stream';
    const container: LogContainer = { logGroupName, logStreamName };

    let logService: ILogService<any, LogContainer>;

    beforeEach(() => {
        cloudwatchMock.reset();
        logService = new CloudWatchLogService();
    });

    describe('putLog', () => {
        it('should send logs successfully with sequence token', async () => {
            const logs = [{ level: 'info', message: 'Test log' }];

            cloudwatchMock
                .on(DescribeLogStreamsCommand)
                .resolves({
                    logStreams: [
                        {
                            logStreamName,
                            uploadSequenceToken: 'abc123',
                        },
                    ],
                });

            cloudwatchMock.on(PutLogEventsCommand).resolves({});

            await expect(logService.putLog(logs, container)).resolves.not.toThrow();

            const sentPutLogCommand = cloudwatchMock.commandCalls(PutLogEventsCommand)[0].args[0].input;
            expect(sentPutLogCommand.logGroupName).toBe(logGroupName);
            expect(sentPutLogCommand.logStreamName).toBe(logStreamName);
            expect(sentPutLogCommand.sequenceToken).toBe('abc123');
            expect(sentPutLogCommand.logEvents?.[0].message).toBe(JSON.stringify(logs[0]));
        });

        it('should send logs when no sequence token is available', async () => {
            const logs = ['Simple log message'];

            cloudwatchMock
                .on(DescribeLogStreamsCommand)
                .resolves({
                    logStreams: [
                        {
                            logStreamName,
                            uploadSequenceToken: undefined,
                        },
                    ],
                });

            cloudwatchMock.on(PutLogEventsCommand).resolves({});

            await expect(logService.putLog(logs, container)).resolves.not.toThrow();
        });

        it('should throw error when DescribeLogStreams fails', async () => {
            const logs = ['Test log'];

            cloudwatchMock.on(DescribeLogStreamsCommand).rejects(new Error('Describe failed'));

            await expect(logService.putLog(logs, container)).rejects.toThrow('Describe failed');
        });

        it('should throw error when PutLogEvents fails', async () => {
            const logs = ['Test log'];

            cloudwatchMock
                .on(DescribeLogStreamsCommand)
                .resolves({
                    logStreams: [{ logStreamName, uploadSequenceToken: 'token' }],
                });

            cloudwatchMock.on(PutLogEventsCommand).rejects(new Error('Put failed'));

            await expect(logService.putLog(logs, container)).rejects.toThrow('Put failed');
        });
    });
});
