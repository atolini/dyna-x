import { ILogger } from '../../logger/contracts';
import { IResponseBuilder } from '../../response-builder/contracts';

/**
 * Interface for an ErrorHandler that processes errors using specific handlers.
 *
 * @template T - The type of the response returned by the handler (e.g., API response type).
 * @template R - The response builder type that implements the `IResponseBuilder<T>` interface.
 */
export interface IErrorHandler<T, R extends IResponseBuilder<T>> {
  /**
   * Handles an error by delegating it to the appropriate handler.
   * If no handler is found, logs the error and returns a generic internal error response.
   *
   * @param error - The error to handle.
   * @returns The generated response.
   */
  handleError(error: Error): T;
}
