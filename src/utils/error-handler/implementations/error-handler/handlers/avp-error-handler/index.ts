import { ILogger } from '../../../../../logger/contracts';
import { IResponseBuilder } from '../../../../../response-builder/contracts';
import { IErrorActions } from '../../../../contracts/i-error-actions';
import { ResourceNotFoundException, AccessDeniedException } from '@aws-sdk/client-verifiedpermissions';

/**
 * Handles Amazon Verified Permissions (AVP) related errors and builds appropriate responses.
 *
 * @template T - Response type
 * @template R - Response builder type
 */
export class AVPAuthorizationErrorHandler<T, R extends IResponseBuilder<T>>
  implements IErrorActions<T, R>
{
  canHandle(error: Error): boolean {
    return (
      error instanceof ResourceNotFoundException ||
      error instanceof AccessDeniedException
    );
  }

  handle(error: Error, logger: ILogger<any>, resBuilder: R): T {
    const message = 'AVP Authorization operation failed';

    if (error instanceof ResourceNotFoundException) {
      logger.error({
        description: `${message}: Resource not found`,
        name: error.name,
        message: error.message,
        details: `The specified resource could not be found in the policy store.`,
      });

      return resBuilder.notFound('The resource was not found') as T;
    }

    if (error instanceof AccessDeniedException) {
      logger.error({
        description: `${message}: Access denied`,
        name: error.name,
        message: error.message,
        details: `The caller does not have permission to perform the requested action on the resource.`,
      });

      return resBuilder.forbidden('Access denied for the requested action') as T;
    }
  }
}