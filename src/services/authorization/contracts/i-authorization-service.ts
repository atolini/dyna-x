import {
  AuthorizationRequest,
  AuthorizationResponse,
  BatchAuthorizationRequest,
  BatchAuthorizationResponse,
} from '.';

/**
 * @template A The type that identifies the action.
 * @template I The type that identifies the identity.
 * @template C The type that identifies the context.
 * @template R The type that identifies the resource.
 *
 * Interface for an authorization service that validates whether identities are allowed to perform actions on resources.
 */
export interface IAuthorizationService<A, I, C, R> {
  /**
   * Validates whether the given identity is authorized to perform the specified action on the resource.
   *
   * @param request The authorization request.
   * @returns A promise resolving to the result of the authorization check.
   */
  isAuthorized(
    request: AuthorizationRequest<A, I, C, R>,
  ): Promise<AuthorizationResponse<R>>;

  /**
   * Validates a batch of authorization requests in a single operation.
   *
   * @param request The batch of authorization requests.
   * @returns A promise resolving to the batch authorization results.
   */
  batchIsAuthorized(
    request: BatchAuthorizationRequest<A, I, C, R>,
  ): Promise<BatchAuthorizationResponse<R>>;
}
