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
 * Service to manage users in AWS Cognito.
 *
 * @template T - The format of the user attributes, must match Cognito's expected structure.
 */
export class CognitoUserService<T extends AttributeType>
  implements IUserService<T>
{
  private client: CognitoIdentityProviderClient;
  private userPoolId: string;

  /**
   * @param region - AWS region.
   * @param userPoolId - Cognito User Pool ID where users will be managed.
   */
  constructor(userPoolId: string, region?: string) {
    this.client = new CognitoIdentityProviderClient(region ? { region } : {});
    this.userPoolId = userPoolId;
  }

  /**
   * Creates a user in Cognito.
   *
   * @param input - Information needed to create the user.
   */
  async createUser(input: CreateUserInput<T>): Promise<void> {
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
   * Updates user attributes in Cognito.
   *
   * @param input - Information about the user and the attributes to update.
   */
  async updateUserAttributes(
    input: UpdateUserAttributesInput<T>,
  ): Promise<void> {
    const command = new AdminUpdateUserAttributesCommand({
      UserPoolId: this.userPoolId,
      Username: input.id,
      UserAttributes: input.userAttributes,
    });

    await this.client.send(command);
  }

  /**
   * Deletes a user from Cognito.
   *
   * @param input - Information about the user to delete.
   */
  async deleteUser(input: DeleteUserInput): Promise<void> {
    const command = new AdminDeleteUserCommand({
      UserPoolId: this.userPoolId,
      Username: input.id,
    });

    await this.client.send(command);
  }
}
