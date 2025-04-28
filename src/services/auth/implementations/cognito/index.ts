import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminUpdateUserAttributesCommand,
  AdminDeleteUserCommand,
  AttributeType,
} from '@aws-sdk/client-cognito-identity-provider';

import {
  IUserService,
  CreateUserInput,
  UpdateUserAttributesInput,
  DeleteUserInput,
} from '../../contracts';

/**
 * @class CognitoUserService
 * @implements {IUserService<AttributeType>}
 * @template AttributeType - The type representing user attributes in Cognito.
 *
 * @classdesc
 * Service to manage users in AWS Cognito.
 *
 * Provides methods to create, update, and delete users using the AWS SDK for JavaScript v3.
 *
 * This class is generic, allowing flexibility to handle different user attribute types.
 * It is intended for use in server-side environments where AWS credentials are available.
 *
 * The constructor requires the AWS region and the Cognito User Pool ID.
 *
 * This service relies on the `@aws-sdk/client-cognito-identity-provider` package.
 *
 * Note: This service focuses on administrative user operations and does not handle authentication flows (tokens, login, refresh, etc.).
 *
 * Methods may throw AWS SDK `ServiceException` errors if network issues occur or if invalid parameters are provided.
 *
 * This class is stateless and safe to be used concurrently across multiple requests.
 */
export class CognitoUserService implements IUserService<AttributeType> {
  private client: CognitoIdentityProviderClient;
  private userPoolId: string;

  /**
   * Creates an instance of CognitoUserService.
   *
   * Initializes the Cognito Identity Provider client to manage users in a specific User Pool.
   *
   * @param {string} userPoolId - The ID of the Cognito User Pool where users will be managed.
   * @param {string} [region] - (Optional) AWS region where the User Pool is located.
   * If not provided, the default region configured in the environment will be used.
   *
   * @example
   * const userService = new CognitoUserService('us-east-1_example', 'us-east-1');
   */
  constructor(userPoolId: string, region?: string) {
    this.client = new CognitoIdentityProviderClient(region ? { region } : {});
    this.userPoolId = userPoolId;
  }

  /**
   * Creates a new user in AWS Cognito User Pool.
   *
   * It uses admin-level permissions to create a user with the provided attributes.
   *
   * @param {CreateUserInput<AttributeType>} input - Information needed to create the user.
   * @returns {Promise<void>} A promise that resolves when the user is successfully created.
   *
   * @example
   * const userService = new CognitoUserService('us-east-1', 'user-pool-id');
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
   */
  async createUser(input: CreateUserInput<AttributeType>): Promise<void> {
    const command = new AdminCreateUserCommand({
      UserPoolId: this.userPoolId,
      Username: input.login,
      TemporaryPassword: input.temporaryPassword,
      UserAttributes: input.userAttributes,
      MessageAction: input.suppressMessage ? 'SUPPRESS' : undefined,
    });

    await this.client.send(command);
  }

  /**
   * Updates user attributes in AWS Cognito User Pool.
   *
   * It uses admin-level permissions to update specified attributes for an existing user.
   *
   * @param {UpdateUserAttributesInput<AttributeType>} input - Information about the user and the attributes to update.
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
   */
  async updateUserAttributes(
    input: UpdateUserAttributesInput<AttributeType>,
  ): Promise<void> {
    const command = new AdminUpdateUserAttributesCommand({
      UserPoolId: this.userPoolId,
      Username: input.id,
      UserAttributes: input.userAttributes,
    });

    await this.client.send(command);
  }

  /**
   * Deletes a user from AWS Cognito User Pool.
   *
   * It uses admin-level permissions to permanently remove a user identified by the username.
   *
   * @param {DeleteUserInput} input - Information about the user to delete, including the user ID.
   * @returns {Promise<void>} A promise that resolves when the user is successfully deleted.
   *
   * @example
   * const userService = new CognitoUserService('user-pool-id');
   * const input = { id: 'example-user-id' };
   * await userService.deleteUser(input);
   *
   */
  async deleteUser(input: DeleteUserInput): Promise<void> {
    const command = new AdminDeleteUserCommand({
      UserPoolId: this.userPoolId,
      Username: input.id,
    });

    await this.client.send(command);
  }
}
