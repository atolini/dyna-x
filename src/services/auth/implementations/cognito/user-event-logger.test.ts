import {
  Logger,
  LoggerContext,
} from '../../../../utils/logger/implementations';
import { UserEventLogger } from './user-event-logger';

describe('UserEventLogger', () => {
  const context: LoggerContext = {
    requestId: 'request-id-01',
    service: 'service-id-01',
    userId: 'user-id-01',
  };
  const logger = new Logger(context);

  const userEventLogger = new UserEventLogger(logger, 'user-pool-id');

  const consoleSpy = jest.spyOn(console, 'log');

  beforeEach(() => {
    consoleSpy.mockClear();
  });

  it('should return undefined when userCreated is called', () => {
    const result = userEventLogger.userCreated('user-name', [
      { Name: 'email', Value: 'user@example.com' },
      { Name: 'email_verified', Value: 'true' },
    ]);

    expect(result).toBeUndefined();
  });

  it('should log userCreated with correct attributes', () => {
    userEventLogger.userCreated('user-name', [
      { Name: 'email', Value: 'user@example.com' },
      { Name: 'email_verified', Value: 'true' },
    ]);

    const loggedArg = consoleSpy.mock.calls[0][0];
    const parsedLog = JSON.parse(loggedArg);

    expect(parsedLog).toMatchObject({
      level: 'info',
      requestId: context.requestId,
      service: context.service,
      userId: context.userId,
      details: {
        message: 'User Created',
        userPoolId: 'user-pool-id',
        userName: 'user-name',
        userAttributes: [
          { Name: 'email', Value: 'user@example.com' },
          { Name: 'email_verified', Value: 'true' },
        ],
      },
    });
  });

  it('should return undefined when userDeleted is called', () => {
    const result = userEventLogger.userDeleted('user-name');
    expect(result).toBeUndefined();
  });

  it('should log userDeleted with correct data', () => {
    userEventLogger.userDeleted('user-name');

    const loggedArg = consoleSpy.mock.calls[0][0];
    const parsedLog = JSON.parse(loggedArg);

    expect(parsedLog).toMatchObject({
      level: 'info',
      requestId: 'request-id-01',
      service: 'service-id-01',
      userId: 'user-id-01',
      details: {
        message: 'User Deleted',
        userPoolId: 'user-pool-id',
        userName: 'user-name',
      },
    });
  });

  it('should return undefined when userUpdated is called', () => {
    const result = userEventLogger.userUpdated('user-name', [
      { Name: 'email', Value: 'user@example.com' },
      { Name: 'email_verified', Value: 'true' },
    ]);
    expect(result).toBeUndefined();
  });

  it('should log userUpdated with correct attributes', () => {
    userEventLogger.userUpdated('user-name', [
      { Name: 'email', Value: 'user@example.com' },
      { Name: 'email_verified', Value: 'true' },
    ]);

    const loggedArg = consoleSpy.mock.calls[0][0];
    const parsedLog = JSON.parse(loggedArg);

    expect(parsedLog).toMatchObject({
      level: 'info',
      requestId: 'request-id-01',
      service: 'service-id-01',
      userId: 'user-id-01',
      details: {
        message: 'User Updated',
        userPoolId: 'user-pool-id',
        userName: 'user-name',
        userAttributes: [
          { Name: 'email', Value: 'user@example.com' },
          { Name: 'email_verified', Value: 'true' },
        ],
      },
    });
  });
});
