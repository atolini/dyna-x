import {
  AuthorizationRequest,
  AuthorizationResponse,
  BatchAuthorizationRequest,
  BatchAuthorizationResponse,
} from '.';

/**
 * @template A The type that identifies the action (e.g., 'read', 'delete').
 * @template E The type that identifies the identity or user (e.g., user ID).
 * @template C The type that identifies the context of the request (e.g., roles, environment, metadata).
 * @template R The type that identifies the resource (e.g., resource ID or ARN).
 *
 * @description
 * Defines the contract for an event logger that tracks authorization checks.
 * Supports logging of both single and batch authorization decisions.
 */
export interface IAuthorizationServiceEventLogger<A, E, C, R> {
  /**
   * Logs a single authorization decision.
   *
   * @param request - The authorization request being evaluated.
   * @param response - The response containing the decision for the request.
   */
  authorizationChecked(
    request: AuthorizationRequest<A, E, C, R>,
    response: AuthorizationResponse<E>,
  ): void;

  /**
   * Logs a batch of authorization decisions.
   *
   * @param request - The batch of authorization requests being evaluated.
   * @param response - The batch response containing decisions for each request.
   */
  batchAuthorizationChecked(
    request: BatchAuthorizationRequest<A, E, C, R>,
    response: BatchAuthorizationResponse<E>,
  ): void;
}
