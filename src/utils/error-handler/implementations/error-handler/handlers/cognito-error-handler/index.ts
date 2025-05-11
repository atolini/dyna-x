import { ILogger } from '../../../../../logger/contracts';
import { IResponseBuilder } from '../../../../../response-builder/contracts';
import { IErrorActions } from '../../../../contracts/i-error-actions';
import {
  InvalidParameterException,
  UserNotFoundException,
  UsernameExistsException,
  LimitExceededException,
  InternalErrorException,
  InvalidPasswordException,
  NotAuthorizedException,
  TooManyRequestsException,
  InvalidEmailRoleAccessPolicyException,
} from '@aws-sdk/client-cognito-identity-provider';

/**
 * @class CognitoErrorHandler
 * @implements {IErrorActions<T, R>}
 * @template T - Response type
 * @template R - Response builder type
 *
 * @classdesc
 * Handles related to Cognito (AWS) errors and builds appropriate responses.
 *
 * The following exceptions may be handled by this class:
 *
 * - **InternalErrorException**: If there is an internal error in the AWS Cognito service.
 * - **InvalidParameterException**: If the provided parameters are invalid.
 * - **InvalidPasswordException**: If the provided password does not meet the policy requirements.
 * - **NotAuthorizedException**: If the caller is not authorized to perform the operation.
 * - **UsernameExistsException**: If the username already exists in the User Pool.
 * - **TooManyRequestsException**: If the request is throttled due to too many requests.
 * - **InvalidEmailRoleAccessPolicyException**: If Cognito isn't allowed to use your email identity.
 * - **UserNotFoundException**: If the specified user does not exist in the User Pool.
 */
export class CognitoErrorHandler<T, R extends IResponseBuilder<T>>
  implements IErrorActions<T, R>
{
  canHandle(error: Error): boolean {
    return (
      error instanceof InternalErrorException ||
      error instanceof InvalidParameterException ||
      error instanceof InvalidPasswordException ||
      error instanceof NotAuthorizedException ||
      error instanceof UsernameExistsException ||
      error instanceof TooManyRequestsException ||
      error instanceof InvalidEmailRoleAccessPolicyException ||
      error instanceof UserNotFoundException
    );
  }

  handle(error: Error, logger: ILogger<any>, resBuilder: R): T {
    const message = 'Cognito operation failed';

    if (error instanceof UserNotFoundException) {
      logger.error({
        description: `${message}: User not found`,
        name: error.name,
        message: error.message,
        details: `The user with the specified identifier does not exist in the Cognito User Pool.`,
      });
      return resBuilder.notFound(error.message) as T;
    }

    if (error instanceof InvalidParameterException) {
      logger.error({
        description: `${message}: Invalid parameter`,
        name: error.name,
        message: error.message,
        details: `One or more parameters are invalid. Please verify the provided input.`,
      });
      return resBuilder.badRequest('Invalid parameter in the request') as T;
    }

    if (error instanceof InvalidPasswordException) {
      logger.error({
        description: `${message}: Invalid password`,
        name: error.name,
        message: error.message,
        details: `The password provided does not meet the security policy requirements.`,
      });
      return resBuilder.badRequest('Password does not meet requirements') as T;
    }

    if (error instanceof NotAuthorizedException) {
      logger.error({
        description: `${message}: Not authorized`,
        name: error.name,
        message: error.message,
        details: `The user or caller is not authorized to perform this operation.`,
      });
      return resBuilder.forbidden(
        'Not authorized to perform this operation',
      ) as T;
    }

    if (error instanceof UsernameExistsException) {
      logger.error({
        description: `${message}: User already exists`,
        name: error.name,
        message: error.message,
        details: `The user with the provided username already exists in the Cognito User Pool.`,
      });
      return resBuilder.badRequest('User already exists') as T;
    }

    if (error instanceof TooManyRequestsException) {
      logger.error({
        description: `${message}: Too many requests`,
        name: error.name,
        message: error.message,
        details: `The request was throttled due to too many requests in a short time.`,
      });
      return resBuilder.tooManyRequests(
        'Too many requests - throttling limit reached',
      ) as T;
    }

    if (error instanceof LimitExceededException) {
      logger.error({
        description: `${message}: Limit exceeded`,
        name: error.name,
        message: error.message,
        details: `The request limit for Cognito has been exceeded. Please try again later.`,
      });
      return resBuilder.tooManyRequests(
        'Request limit exceeded for Cognito',
      ) as T;
    }

    if (error instanceof InvalidEmailRoleAccessPolicyException) {
      logger.error({
        description: `${message}: Invalid email role access policy`,
        name: error.name,
        message: error.message,
        details: `Cognito is not authorized to send email using the configured identity. Verify your SES configuration.`,
      });
      return resBuilder.internalError(
        'Invalid email role access policy configuration',
      ) as T;
    }

    if (error instanceof InternalErrorException) {
      logger.error({
        description: `${message}: Internal error`,
        name: error.name,
        message: error.message,
        details: `An internal error occurred within AWS Cognito.`,
      });
      return resBuilder.internalError(
        'Internal error occurred in Cognito',
      ) as T;
    }
  }
}
