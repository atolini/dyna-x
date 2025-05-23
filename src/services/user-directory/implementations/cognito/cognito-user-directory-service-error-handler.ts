import { ILogger } from '@logger/contracts/i-logger';
import { IResponseBuilder } from '@response-builder/contracts';
import { IErrorActions } from '@error-handler/contracts';
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
 * @implements {IErrorActions<T, R>}
 * @template T - Response type
 * @template R - Response builder type
 *
 * Handles exceptions thrown within the {@link CognitoUserService} class.
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
export class CognitoUserDirectoryServiceErrorHandler<
  T,
  R extends IResponseBuilder<T>,
> implements IErrorActions<T, R>
{
  /**
   * Checks if the error can be handled by this handler.
   *
   * @param {Error} error - The error to check.
   * @returns {boolean} True if the error is one of the handled Cognito exceptions, false otherwise.
   */
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

  /**
   *  Handles the provided error and builds an appropriate response using the response builder.
   *
   * @param {Error} error - The error to handle.
   * @param {ILogger<any>} logger - The logger instance for logging the error.
   * @param {R} resBuilder - The response builder instance.
   * @returns {T} The built response for the handled error.
   */
  handle(error: Error, logger: ILogger<any>, resBuilder: R): T {
    if (error instanceof UserNotFoundException) {
      logger.error({
        name: error.name,
        message: error.message,
      });
      return resBuilder.notFound(error.message);
    }

    if (error instanceof InvalidParameterException) {
      logger.error({
        name: error.name,
        message: error.message,
      });
      return resBuilder.badRequest('Invalid parameter in the request');
    }

    if (error instanceof InvalidPasswordException) {
      logger.error({
        name: error.name,
        message: error.message,
      });
      return resBuilder.badRequest('Password does not meet requirements');
    }

    if (error instanceof NotAuthorizedException) {
      logger.error({
        name: error.name,
        message: error.message,
      });
      return resBuilder.forbidden('Not authorized to perform this operation');
    }

    if (error instanceof UsernameExistsException) {
      logger.error({
        name: error.name,
        message: error.message,
      });
      return resBuilder.badRequest('User already exists');
    }

    if (error instanceof TooManyRequestsException) {
      logger.error({
        name: error.name,
        message: error.message,
      });
      return resBuilder.tooManyRequests(
        'Too many requests - throttling limit reached',
      );
    }

    if (error instanceof LimitExceededException) {
      logger.error({
        name: error.name,
        message: error.message,
      });
      return resBuilder.tooManyRequests('Request limit exceeded for Cognito');
    }

    if (error instanceof InvalidEmailRoleAccessPolicyException) {
      logger.error({
        name: error.name,
        message: error.message,
      });
      return resBuilder.internalError(
        'Invalid email role access policy configuration',
      );
    }

    if (error instanceof InternalErrorException) {
      logger.error({
        name: error.name,
        message: error.message,
      });
      return resBuilder.internalError('Internal error occurred in Cognito');
    }
  }
}
