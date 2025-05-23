import { ILogger } from '@logger/contracts';
import { IResponseBuilder } from '@response-builder/contracts';
import { IErrorActions } from '@error-handler/contracts';
import { InternalException } from '@aws-sdk/client-eventbridge';

/**
 * @template T - The final response type returned by the response builder.
 * @template R - A type extending {@link IResponseBuilder}, used to construct standardized responses.
 *
 * A specialized error handler for managing AWS EventBridge-related exceptions,
 * particularly those encountered during event dispatching processes.
 *
 * This handler currently supports the following AWS SDK exception:
 * - {@link InternalException}: Indicates an internal service error from AWS EventBridge.
 *
 * This class is designed to be used within the {@link EventBridgeEventDispatcherService}
 * to capture and respond to known exceptions in a structured and centralized manner.
 */
export class EventBridgeEventDispatcherErrorHandler<
  T,
  R extends IResponseBuilder<T>,
> implements IErrorActions<T, R>
{
  /**
   * Determines whether this handler is capable of processing the given error.
   *
   * @param error - The error instance to evaluate.
   * @returns {boolean} `true` if the error is supported by this handler; otherwise, `false`.
   */
  canHandle(error: Error): boolean {
    return error instanceof InternalException;
  }

  /**
   * Handles a supported error by logging its details and returning an appropriate response.
   *
   * @param error - The error to handle.
   * @param logger - Logger used to record the error details.
   * @param resBuilder - A response builder used to construct a standardized response.
   * @returns {T} The response object generated for the specific handled error.
   */
  handle(error: Error, logger: ILogger<any>, resBuilder: R): T {
    const errorMap = [
      {
        type: InternalException,
        log: {},
        response: () => resBuilder.internalError(),
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
