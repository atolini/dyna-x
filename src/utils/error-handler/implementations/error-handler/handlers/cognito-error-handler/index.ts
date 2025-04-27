import { ILogger } from '../../../../../logger/contracts';
import { IResponseBuilder } from '../../../../../response-builder/contracts';
import { IErrorActions } from '../../../../contracts/i-error-actions';
import {
  InvalidParameterException,
  UserNotFoundException,
  UsernameExistsException,
  LimitExceededException,
} from '@aws-sdk/client-cognito-identity-provider';

/**
 * Handles Cognito-related errors and builds appropriate responses.
 *
 * @template T - Response type
 * @template R - Response builder type
 */
export class CognitoErrorHandler<T, R extends IResponseBuilder<T>>
  implements IErrorActions<T, R>
{
  canHandle(error: Error): boolean {
    return (
      error instanceof UserNotFoundException ||
      error instanceof InvalidParameterException ||
      error instanceof UsernameExistsException ||
      error instanceof LimitExceededException
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

    if (error instanceof UsernameExistsException) {
      logger.error({
        description: `${message}: User already exists`,
        name: error.name,
        message: error.message,
        details: `The user with the provided username already exists in the Cognito User Pool.`,
      });

      return resBuilder.badRequest('User already exists') as T;
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
  }
}
