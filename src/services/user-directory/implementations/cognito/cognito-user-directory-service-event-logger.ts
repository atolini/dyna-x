import { AttributeType } from '@aws-sdk/client-cognito-identity-provider';
import { ILogger } from '@logger/contracts';
import { IUserDirectoryServiceEventLogger } from '@user-directory/contracts';

/**
 * @class CognitoUserDirectoryServiceEventLogger
 * @implements IUserDirectoryServiceEventLogger
 *
 * @classdesc
 * Helper class responsible for logging user-related events performed by the {@link CognitoUserService}.
 *
 * Logs creation, update, and deletion of users in a structured format using the provided logger instance.
 *
 * This logger focuses on capturing key user events for observability and auditability.
 *
 * @example
 * const logger = new ConsoleLogger(); // implements ILogger
 * const eventLogger = new UserEventLogger(logger, 'us-east-1_example');
 * eventLogger.userCreated('john.doe', [{ Name: 'email', Value: 'john.doe@example.com' }]);
 */
export class CognitoUserDirectoryServiceEventLogger implements IUserDirectoryServiceEventLogger<AttributeType[]> {
  private logger: ILogger<unknown>;
  private readonly userPoolId: string;

  /**
   * Creates an instance of UserEventLogger.
   *
   * @param {ILogger<any>} logger - A logger instance that implements the ILogger interface.
   * @param {string} userPoolId - The ID of the Cognito User Pool associated with the user events.
   */
  constructor(logger: ILogger<unknown>, userPoolId: string) {
    this.logger = logger;
    this.userPoolId = userPoolId;
  }

  /**
   * Logs a user creation event.
   *
   * @param {string} userName - The username of the newly created user.
   * @param {AttributeType[]} userAttributes - The list of attributes set for the new user.
   */
  public userCreated(userName: string, userAttributes: AttributeType[]): void {
    this.logger.info({
      message: 'User Created',
      userPoolId: this.userPoolId,
      userName,
      userAttributes,
    });
  }

  /**
   * Logs a user update event.
   *
   * @param {string} userName - The username of the user whose attributes were updated.
   * @param {AttributeType[]} userAttributes - The updated attributes.
   */
  public userUpdated(userName: string, userAttributes: AttributeType[]): void {
    this.logger.info({
      message: 'User Updated',
      userPoolId: this.userPoolId,
      userName,
      userAttributes,
    });
  }

  /**
   * Logs a user deletion event.
   *
   * @param {string} userName - The username of the user that was deleted.
   */
  public userDeleted(userName: string): void {
    this.logger.info({
      message: 'User Deleted',
      userPoolId: this.userPoolId,
      userName,
    });
  }
}
