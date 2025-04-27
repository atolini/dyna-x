/**
 * Interface to standardize API responses.
 * Allows defining a return type `R` for all responses.
 *
 * @template R - The expected return type for the methods.
 */
export interface IResponseBuilder<R> {
  /**
   * Returns a success response with status 200 (OK).
   *
   * @template T - The type of the data returned in the response.
   * @param data - The data to be included in the response.
   * @returns A formatted response of type `R`.
   */
  ok<T>(data: T): R;

  /**
   * Returns a success response with status 201 (Created).
   *
   * @template T - The type of the data returned in the response.
   * @param data - The data to be included in the response.
   * @returns A formatted response of type `R`.
   */
  created<T>(data: T): R;

  /**
   * Returns an error response with status 404 (Not Found).
   *
   * @param message - The message explaining what was not found.
   * @returns A formatted response of type `R`.
   */
  notFound(message: string): R;

  /**
   * Returns an error response with status 400 (Bad Request).
   *
   * @param message - The error message to be returned.
   * @param details - (Optional) Additional details about the error.
   * @returns A formatted response of type `R`.
   */
  badRequest(message: string, details?: unknown): R;

  /**
   * Returns an internal server error response with status 500 (Internal Server Error).
   *
   * @param message - (Optional) Custom error message. Default: `'Internal Server Error'`.
   * @param details - (Optional) Additional details about the error.
   * @returns A formatted response of type `R`.
   */
  internalError(message?: string, details?: unknown): R;

  /**
   * Returns an error response with status 429 (Too Many Requests).
   *
   * @param message - (Optional) Custom error message. Default: `'Too Many Requests'`.
   * @param details - (Optional) Additional details about the error, such as retry-after time.
   * @returns A formatted response of type `R`.
   */
  tooManyRequests(message?: string, details?: unknown): R;

  /**
   * Returns a custom response with a user-defined status and structure.
   *
   * @template T - The type of the data returned in the response.
   * @param statusCode - The HTTP status code to be returned.
   * @param success - Indicates whether the response represents success (`true`) or failure (`false`).
   * @param payload - The data to be included in the response.
   * @returns A formatted response of type `R`.
   */
  custom<T>(statusCode: number, success: boolean, payload: T): R;

  /**
   * Returns an error response with status 403 (Forbidden).
   *
   * @param message - The error message to be returned.
   * @param details - (Optional) Additional details about the error.
   * @returns A formatted response of type `R`.
   */
  forbidden(message: string, details?: unknown): R;
}
