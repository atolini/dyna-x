import { ILogger } from "@logger/i-logger";
import { IResponseBuilder } from "@response-builder/i-response-builder";
import { DynamoErrorHandler } from "./handlers/dynamo-error-handler/dynamo-error-handler";
import { ErrorActions } from "./error-actions";

/**
 * ErrorHandler class handles errors by using specific error action handlers.
 * It checks which handler can process a given error and invokes it.
 * If no handler is found, it returns a generic internal error response.
 *
 * @template T - The type of the response returned by the handler (e.g., API response type).
 * @template R - The response builder type that implements the `IApiResponse<T>` interface.
 */
export class ErrorHandler<T, R extends IResponseBuilder<T>> {
  private handlers: ErrorActions<T, R>[];  // List of error handlers
  private logger: ILogger<any>;  // Logger instance for error logging
  private resBuilder: R;  // Response builder (used to create error responses)

  /**
   * Creates an instance of the ErrorHandler.
   * 
   * @param resBuilder - The response builder used to create error responses.
   * @param logger - Optional logger instance to log errors.
   * @param handlers - Optional list of custom error handlers to process errors.
   */
  constructor(
    resBuilder: R,
    logger: ILogger<any>,
    handlers?: ErrorActions<T, R>[]
  ) {
    this.resBuilder = resBuilder;
    this.logger = logger;
    this.handlers = handlers ?? [
      new DynamoErrorHandler<T, R>()  // Default handler for DynamoDB-related errors
    ];
  }

  /**
   * Handles errors by finding the appropriate handler from the list of registered handlers.
   * If a handler is found, it processes the error and returns a response.
   * If no handler is found, it logs the error and returns a generic internal error response.
   * 
   * @param error - The error to be handled.
   * @returns The response generated by the handler, or a generic error response.
   */
  public handleError(error: Error): T {
    const handler = this.handlers.find((h) => h.canHandle(error));
    
    // If a handler is found, process the error using that handler
    if (handler) {
      return handler.handle(error, this.logger, this.resBuilder);
    }
    
    // If no handler is found, log a generic error
    this.logger.error({
      description: "An unexpected error occurred. Please check the application logs for more details.",
      message: error.message,
      name: error.name,
      error: error
    });

    // Return a generic internal error response
    return this.resBuilder.internalError("Unhandled error") as T;
  }
}