/**
 * Represents an authorization request for a specific resource.
 *
 * @template A The type that identifies the action (e.g., 'read', 'delete').
 * @template I The type that identifies the identity or user (e.g., user ID).
 * @template C The type that identifies the context of the request (e.g., roles, environment, metadata).
 * @template R The type that identifies the resource (e.g., resource ID or ARN).
 */
export interface AuthorizationRequest<A, I, C, R> {
    entityId: I;
    action: A;
    context?: C;
    resourceId: R;
}

/**
 * Represents a batch of authorization requests.
 *
 * @template A The type that identifies the action.
 * @template I The type that identifies the identity.
 * @template C The type that identifies the context.
 * @template R The type that identifies the resource.
 */
export interface BatchAuthorizationRequest<A, I, C, R> {
    requests: AuthorizationRequest<A, I, C, R>[];
}

/**
 * Represents the result of an individual authorization check.
 *
 * @template R The type that identifies the resource.
 */
export interface AuthorizationResponse<R> {
    recourseId: R;
    decision: 'ALLOW' | 'DENY';
}

/**
 * Represents the result of a batch authorization check.
 *
 * @template R The type that identifies the resource.
 */
export interface BatchAuthorizationResponse<R> {
    results: AuthorizationResponse<R>[];
}

/**
 * Interface for an authorization service that validates whether identities are allowed to perform actions on resources.
 *
 * @template A The type that identifies the action.
 * @template I The type that identifies the identity.
 * @template C The type that identifies the context.
 * @template R The type that identifies the resource.
 */
export interface IAuthorizationService<A, I, C, R> {
    /**
     * Validates whether the given identity is authorized to perform the specified action on the resource.
     *
     * @param request The authorization request.
     * @returns A promise resolving to the result of the authorization check.
     */
    isAuthorized(
        request: AuthorizationRequest<A, I, C, R>
    ): Promise<AuthorizationResponse<R>>;

    /**
     * Validates a batch of authorization requests in a single operation.
     *
     * @param request The batch of authorization requests.
     * @returns A promise resolving to the batch authorization results.
     */
    batchIsAuthorized(
        request: BatchAuthorizationRequest<A, I, C, R>
    ): Promise<BatchAuthorizationResponse<R>>;
}