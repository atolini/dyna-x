import { Logger } from '.';
import { ILogger } from '../../contracts';

describe('Logger', () => {
  const context = { service: 'TestService', requestId: 'req-123' };
  let logger: ILogger<typeof context>;
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new Logger(context);
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it('should log an info message with string', () => {
    logger.info('This is an info log');

    expect(logSpy).toHaveBeenCalledTimes(1);
    const logOutput = JSON.parse(logSpy.mock.calls[0][0]);

    expect(logOutput).toMatchObject({
      level: 'info',
      service: 'TestService',
      requestId: 'req-123',
      message: 'This is an info log',
    });
    expect(logOutput.timestamp).toBeDefined();
  });

  it('should log a warn message with object', () => {
    logger.warn({ warningCode: 'LOW_DISK' });

    expect(logSpy).toHaveBeenCalledTimes(1);
    const logOutput = JSON.parse(logSpy.mock.calls[0][0]);

    expect(logOutput).toMatchObject({
      level: 'warn',
      service: 'TestService',
      requestId: 'req-123',
      warningCode: 'LOW_DISK',
    });
    expect(logOutput.timestamp).toBeDefined();
  });

  it('should log an error message with string', () => {
    logger.error('An unexpected error occurred');

    const logOutput = JSON.parse(logSpy.mock.calls[0][0]);
    expect(logOutput).toMatchObject({
      level: 'error',
      message: 'An unexpected error occurred',
      service: 'TestService',
      requestId: 'req-123',
    });
  });

  it('should merge context and object fields correctly', () => {
    logger.info({ userId: 'user-1', action: 'login' });

    const logOutput = JSON.parse(logSpy.mock.calls[0][0]);
    expect(logOutput).toMatchObject({
      level: 'info',
      service: 'TestService',
      requestId: 'req-123',
      userId: 'user-1',
      action: 'login',
    });
  });

  it('should override context fields if item has same keys', () => {
    logger.info({ service: 'OverrideService', custom: true });

    const logOutput = JSON.parse(logSpy.mock.calls[0][0]);
    expect(logOutput).toMatchObject({
      service: 'OverrideService', // overridden
      custom: true,
      requestId: 'req-123', // still from context
    });
  });
});
