import { ILogger } from '../../../../../logger/contracts';
import { IResponseBuilder } from '../../../../../response-builder/contracts';
import { IErrorActions } from '../../../../contracts/i-error-actions';
import {
  ResourceNotFoundException,
  AccessDeniedException,
  ValidationException,
  ThrottlingException,
  InternalServerException,
} from '@aws-sdk/client-verifiedpermissions';

/**
 * @class AVPAuthorizationErrorHandler
 * @implements {IErrorActions<T, R>}
 * @template T - Response type
 * @template R - Response builder type
 *
 * @classdesc
 * Handles errors related to Amazon Verified Permissions (AVP) authorization operations and builds appropriate responses.
 *
 * The following exceptions may be handled by this class:
 *
 * - **ResourceNotFoundException**: Thrown if the resource does not exist.
 * - **AccessDeniedException**: Thrown if the caller does not have permission to perform the action.
 * - **ValidationException**: Thrown if the request parameters are invalid.
 * - **ThrottlingException**: Thrown if the request is throttled due to exceeding usage limits.
 * - **InternalServerException**: Thrown if an internal server error occurs.
 */
export class AVPAuthorizationErrorHandler<T, R extends IResponseBuilder<T>>
  implements IErrorActions<T, R>
{
  canHandle(error: Error): boolean {
    return (
      error instanceof ResourceNotFoundException ||
      error instanceof AccessDeniedException ||
      error instanceof ValidationException ||
      error instanceof ThrottlingException ||
      error instanceof InternalServerException
    );
  }

  handle(error: Error, logger: ILogger<any>, resBuilder: R): T {
    const message = 'AVP Authorization operation failed';

    const errorMap = [
      {
        type: ResourceNotFoundException,
        log: {
          description: `${message}: Resource not found`,
          details:
            'The specified resource could not be found in the policy store.',
        },
        response: () => resBuilder.notFound('The resource was not found'),
      },
      {
        type: AccessDeniedException,
        log: {
          description: `${message}: Access denied`,
          details:
            'The caller does not have permission to perform the requested action on the resource.',
        },
        response: () =>
          resBuilder.forbidden('Access denied for the requested action'),
      },
      {
        type: ValidationException,
        log: {
          description: `${message}: Validation error`,
          details: 'The request parameters are invalid.',
        },
        response: () => resBuilder.badRequest('Invalid request parameters'),
      },
      {
        type: ThrottlingException,
        log: {
          description: `${message}: Throttling error`,
          details: 'The request was throttled due to exceeding usage limits.',
        },
        response: () =>
          resBuilder.tooManyRequests(
            'Request was throttled due to exceeding usage limits',
          ),
      },
      {
        type: InternalServerException,
        log: {
          description: `${message}: Internal server error`,
          details: 'An internal server error occurred.',
        },
        response: () =>
          resBuilder.internalError('Internal server error occurred'),
      },
    ];

    for (const entry of errorMap) {
      if (error instanceof entry.type) {
        logger.error({
          description: entry.log.description,
          name: error.name,
          message: error.message,
          details: entry.log.details,
        });

        return entry.response() as T;
      }
    }
  }
}
