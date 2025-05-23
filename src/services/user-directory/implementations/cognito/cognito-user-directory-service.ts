import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminUpdateUserAttributesCommand,
  AdminDeleteUserCommand,
  AttributeType,
} from '@aws-sdk/client-cognito-identity-provider';

import {
  IUserDirectoryService,
  CreateUserInput,
  UpdateUserAttributesInput,
  DeleteUserInput,
  IUserDirectoryServiceEventLogger,
} from '@user-directory/contracts';

/**
 * @implements {IUserDirectoryService<AttributeType>}
 *
 * Service class for managing users in an AWS Cognito User Pool using administrative operations.
 *
 * Provides methods to create, update, and delete users using the AWS SDK for JavaScript v3.
 *
 * It is intended for use in server-side environments where AWS credentials are available.
 *
 * The constructor requires the AWS region, the Cognito User Pool ID e o eventLogger.
 *
 * Note: This service focuses on administrative user operations and does not handle authentication flows (tokens, login, refresh, etc.).
 *
 * This class is stateless and safe to be used concurrently across multiple requests.
 *
 * @example
 * const logger: IUserDirectoryServiceEventLogger<AttributeType[]> = ...;
 * const userService = new CognitoUserDirectoryService('us-east-1_examplePoolId', logger, 'us-east-1');
 * await userService.createUser({
 *   login: 'example@mail.com',
 *   userAttributes: [
 *     { Name: 'email', Value: 'example@mail.com' },
 *     { Name: 'phone_number', Value: '+15555555555' },
 *   ],
 *   temporaryPassword: 'TemporaryPassword123!',
 *   suppressMessage: true
 * });
 */
export class CognitoUserDirectoryService
  implements IUserDirectoryService<AttributeType>
{
  private readonly client: CognitoIdentityProviderClient;
  private readonly userPoolId: string;
  private readonly eventLogger: IUserDirectoryServiceEventLogger<
    AttributeType[]
  >;

  /**
   * Creates an instance of CognitoUserService.
   *
   * Initializes the Cognito Identity Provider client to manage users in a specific User Pool.
   *
   * @param {string} userPoolId - The ID of the Cognito User Pool where users will be managed.
   * @param {IUserDirectoryServiceEventLogger} eventLogger - Logger instance used to record user-related events.
   * @param {string} [region] - (Optional) AWS region where the User Pool is located.
   * If not provided, the default region configured in the environment will be used.
   *
   * @example
   * const userService = new CognitoUserService('us-east-1_example', 'us-east-1');
   */
  constructor(
    userPoolId: string,
    eventLogger: IUserDirectoryServiceEventLogger<AttributeType[]>,
    region?: string,
  ) {
    this.client = new CognitoIdentityProviderClient(region ? { region } : {});
    this.userPoolId = userPoolId;
    this.eventLogger = eventLogger;
  }

  /**
   * Creates a new user in AWS Cognito User Pool.
   *
   * It uses admin-level permissions to create a user with the provided attributes.
   *
   * To call this function you must send CreateUserInput with the following parameters:
   * - `login`: The username for the new user.
   * - `userAttributes`: An array of user attributes to set for the new user.
   * - `temporaryPassword`: A temporary password for the new user.
   * - `suppressMessage`: (Optional) If true, suppresses the welcome message sent to the user.
   *
   * @param {CreateUserInput<AttributeType>} input - Information needed to create the user.
   * @returns {Promise<void>} A promise that resolves when the user is successfully created.
   *
   * @example
   * const userService = new CognitoUserService('user-pool-id', 'us-east-1');
   * const input = {
   *   login: 'example@mail.com',
   *   userAttributes: [
   *     { Name: 'email', Value: 'example@mail.com' },
   *     { Name: 'phone_number', Value: '+15555555555' },
   *   ],
   *   temporaryPassword: 'TemporaryPassword123!',
   *   suppressMessage: true,
   * };
   * await userService.createUser(input);
   *
   * @throws {InternalErrorException} If there is an internal error in the AWS Cognito service.
   * @throws {InvalidParameterException} If the provided parameters are invalid.
   * @throws {InvalidPasswordException} If the provided password does not meet the policy requirements.
   * @throws {NotAuthorizedException} If the caller is not authorized to perform the operation.
   * @throws {UsernameExistsException} If the username already exists in the User Pool.
   * @throws {TooManyRequestsException} If the request is throttled due to too many requests.
   *
   * This function uses the AWS SDK command:
   * - {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/cognito-identity-provider/command/AdminCreateUserCommand/ | AdminCreateUserCommand}
   */
  async createUser(input: CreateUserInput<AttributeType>): Promise<void> {
    const userName = input.login;
    const userAttributes = input.userAttributes;

    const command = new AdminCreateUserCommand({
      UserPoolId: this.userPoolId,
      Username: userName,
      TemporaryPassword: input.temporaryPassword,
      UserAttributes: userAttributes,
      MessageAction: input.suppressMessage ? 'SUPPRESS' : undefined,
    });

    await this.client.send(command);

    this.eventLogger.userCreated(userName, userAttributes);
  }

  /**
   * Updates user attributes in AWS Cognito User Pool.
   *
   * It uses admin-level permissions to update specified attributes for an existing user.
   *
   * This function can set a user's email address or phone number as verified and permit immediate sign-in in user pools that require verification of these attributes.
   * To do this, set the email_verified or phone_number_verified attribute to true.
   *
   * @param {UpdateUserAttributesInput<AttributeType>} input - Information about the user (user ID) and the attributes to update.
   * @returns {Promise<void>} A promise that resolves when the user's attributes are successfully updated.
   *
   * @example
   * const userService = new CognitoUserService('user-pool-id');
   * const input = {
   *   id: 'example-user-id',
   *   userAttributes: [
   *     { Name: 'email_verified', Value: 'true' },
   *     { Name: 'phone_number', Value: '+15555555555' },
   *   ],
   * };
   * await userService.updateUserAttributes(input);
   *
   * @throws {InvalidEmailRoleAccessPolicyException} If Cognito isn't allowed to use your email identity.
   * @throws {InternalErrorException} If there is an internal error in the AWS Cognito service.
   * @throws {InvalidParameterException} If the provided parameters are invalid.
   * @throws {NotAuthorizedException} If the caller is not authorized to perform the operation.
   * @throws {UserNotFoundException} If the specified user does not exist in the User Pool.
   *
   * This function uses the AWS SDK command:
   * - {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/cognito-identity-provider/command/AdminUpdateUserAttributesCommand/ | AdminUpdateUserAttributesCommand}
   */
  async updateUserAttributes(
    input: UpdateUserAttributesInput<AttributeType>,
  ): Promise<void> {
    const userName = input.id;
    const userAttributes = input.userAttributes;

    const command = new AdminUpdateUserAttributesCommand({
      UserPoolId: this.userPoolId,
      Username: userName,
      UserAttributes: userAttributes,
    });

    await this.client.send(command);

    this.eventLogger.userUpdated(userName, userAttributes);
  }

  /**
   * Deletes a user from AWS Cognito User Pool.
   *
   * It uses admin-level permissions to permanently remove a user identified by the username.
   *
   * @param {DeleteUserInput} input - Information about the user to delete, including the Cognito username (User ID).
   * @returns {Promise<void>} A promise that resolves when the user is successfully deleted.
   *
   * @example
   * const userService = new CognitoUserService('user-pool-id');
   * const input = { id: 'example-user-id' };
   * await userService.deleteUser(input);
   *
   * @throws {InternalErrorException} If there is an internal error in the AWS Cognito service.
   * @throws {InvalidParameterException} If the provided parameters are invalid.
   * @throws {NotAuthorizedException} If the caller is not authorized to perform the operation.
   * @throws {UserNotFoundException} If the specified user does not exist in the User Pool.
   * @throws {TooManyRequestsException} If the request is throttled due to too many requests.
   *
   * This function uses the AWS SDK command:
   * - {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/cognito-identity-provider/command/AdminDeleteUserCommand/ | AdminDeleteUserCommand}
   */
  async deleteUser(input: DeleteUserInput): Promise<void> {
    const userName = input.id;

    const command = new AdminDeleteUserCommand({
      UserPoolId: this.userPoolId,
      Username: userName,
    });

    await this.client.send(command);

    this.eventLogger.userDeleted(userName);
  }
}
