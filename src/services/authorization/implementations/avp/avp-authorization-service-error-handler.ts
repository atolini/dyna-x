import { ILogger } from '@logger/contracts/i-logger';
import { IResponseBuilder } from '@response-builder/contracts';
import { IErrorActions } from '@error-handler/contracts';
import {
  ResourceNotFoundException,
  AccessDeniedException,
  ValidationException,
  ThrottlingException,
  InternalServerException,
} from '@aws-sdk/client-verifiedpermissions';

/**
 * @implements {IErrorActions<T, R>}
 * @template T - Response type
 * @template R - Response builder type
 *
 * Handles exceptions thrown within the {@link AVPAuthorizationService} class.
 *
 * The following exceptions may be handled by this class:
 *
 * - **ResourceNotFoundException**: Thrown if the resource does not exist.
 * - **AccessDeniedException**: Thrown if the caller does not have permission to perform the action.
 * - **ValidationException**: Thrown if the request parameters are invalid.
 * - **ThrottlingException**: Thrown if the request is throttled due to exceeding usage limits.
 * - **InternalServerException**: Thrown if an internal server error occurs.
 */
export class AVPAuthorizationServiceErrorHandler<
  T,
  R extends IResponseBuilder<T>,
> implements IErrorActions<T, R>
{
  /**
   *
   */
  canHandle(error: Error): boolean {
    return (
      error instanceof ResourceNotFoundException ||
      error instanceof AccessDeniedException ||
      error instanceof ValidationException ||
      error instanceof ThrottlingException ||
      error instanceof InternalServerException
    );
  }

  /**
   *
   */
  handle(error: Error, logger: ILogger<any>, resBuilder: R): T {
    const errorMap = [
      {
        type: ResourceNotFoundException,
        log: {},
        response: () => resBuilder.notFound('The resource was not found'),
      },
      {
        type: AccessDeniedException,
        log: {},
        response: () =>
          resBuilder.forbidden('Access denied for the requested action'),
      },
      {
        type: ValidationException,
        log: {},
        response: () => resBuilder.badRequest('Invalid request parameters'),
      },
      {
        type: ThrottlingException,
        log: {},
        response: () =>
          resBuilder.tooManyRequests(
            'Request was throttled due to exceeding usage limits',
          ),
      },
      {
        type: InternalServerException,
        log: {},
        response: () =>
          resBuilder.internalError('Internal server error occurred'),
      },
    ];

    for (const entry of errorMap) {
      if (error instanceof entry.type) {
        logger.error({
          name: error.name,
          message: error.message,
        });

        return entry.response();
      }
    }
  }
}
