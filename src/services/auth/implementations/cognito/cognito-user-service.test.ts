import { mockClient } from 'aws-sdk-client-mock';
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminUpdateUserAttributesCommand,
  AdminDeleteUserCommand,
  AttributeType,
} from '@aws-sdk/client-cognito-identity-provider';

import { CognitoUserService } from './';
import {
  IUserService,
  CreateUserInput,
  UpdateUserAttributesInput,
  DeleteUserInput,
} from '../../contracts';

describe('CognitoUserService', () => {
  const cognitoMock = mockClient(CognitoIdentityProviderClient);
  const region = 'us-east-1';
  const userPoolId = 'us-east-1_testpool';
  let userService: IUserService<AttributeType>;

  beforeEach(() => {
    cognitoMock.reset();
    userService = new CognitoUserService(region, userPoolId);
  });

  describe('createUser', () => {
    const input: CreateUserInput<AttributeType> = {
      login: 'user@example.com',
      userAttributes: [
        { Name: 'email', Value: 'user@example.com' },
        { Name: 'email_verified', Value: 'true' },
      ],
      temporaryPassword: 'Temp@123',
      suppressMessage: true,
    };

    it('should create user successfully', async () => {
      cognitoMock.on(AdminCreateUserCommand).resolves({});

      await expect(userService.createUser(input)).resolves.not.toThrow();
    });

    it('should throw error if Cognito fails to create user', async () => {
      cognitoMock
        .on(AdminCreateUserCommand)
        .rejects(new Error('Create failed'));

      await expect(userService.createUser(input)).rejects.toThrow(
        'Create failed',
      );
    });
  });

  describe('updateUserAttributes', () => {
    const input: UpdateUserAttributesInput<AttributeType> = {
      id: 'user@example.com',
      userAttributes: [{ Name: 'custom:role', Value: 'admin' }],
    };

    it('should update user attributes successfully', async () => {
      cognitoMock.on(AdminUpdateUserAttributesCommand).resolves({});

      await expect(
        userService.updateUserAttributes(input),
      ).resolves.not.toThrow();
    });

    it('should throw error if Cognito fails to update attributes', async () => {
      cognitoMock
        .on(AdminUpdateUserAttributesCommand)
        .rejects(new Error('Update failed'));

      await expect(userService.updateUserAttributes(input)).rejects.toThrow(
        'Update failed',
      );
    });
  });

  describe('deleteUser', () => {
    const input: DeleteUserInput = {
      id: 'user@example.com',
    };

    it('should delete user successfully', async () => {
      cognitoMock.on(AdminDeleteUserCommand).resolves({});

      await expect(userService.deleteUser(input)).resolves.not.toThrow();
    });

    it('should throw error if Cognito fails to delete user', async () => {
      cognitoMock
        .on(AdminDeleteUserCommand)
        .rejects(new Error('Delete failed'));

      await expect(userService.deleteUser(input)).rejects.toThrow(
        'Delete failed',
      );
    });
  });
});
