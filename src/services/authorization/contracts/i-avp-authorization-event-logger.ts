import {
  AuthorizationRequest,
  AuthorizationResponse,
  BatchAuthorizationRequest,
  BatchAuthorizationResponse,
} from '.';

/**
 * @interface IAVPAuthorizationEventLogger
 * @template A The type that identifies the action (e.g., 'read', 'delete').
 * @template I The type that identifies the identity or user (e.g., user ID).
 * @template C The type that identifies the context of the request (e.g., roles, environment, metadata).
 * @template R The type that identifies the resource (e.g., resource ID or ARN).
 *
 * @description
 * Defines the contract for an event logger that tracks authorization checks made via AWS Verified Permissions.
 *
 * This interface supports logging of both single and batch authorization decisions.
 */
export interface IAVPAuthorizationEventLogger<A, E, C, R> {
  /**
   * Logs a single authorization decision.
   *
   * @param request - The authorization request sent to AVP.
   * @param response - The response received from AVP containing the decision.
   */
  authorizationChecked(
    request: AuthorizationRequest<A, E, C, R>,
    response: AuthorizationResponse<E>,
  ): void;

  /**
   * Logs a batch of authorization decisions.
   *
   * @param request - The batch of authorization requests sent to AVP.
   * @param response - The batch response from AVP containing decisions for each request.
   */
  batchAuthorizationChecked(
    request: BatchAuthorizationRequest<A, E, C, R>,
    response: BatchAuthorizationResponse<E>,
  ): void;
}
