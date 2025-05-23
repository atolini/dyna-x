/**
 * @template A The type that identifies the action (e.g., 'read', 'delete').
 * @template I The type that identifies the identity or user (e.g., user ID).
 * @template C The type that identifies the context of the request (e.g., roles, environment, metadata).
 * @template R The type that identifies the resource (e.g., resource ID or ARN).
 *
 * Represents an authorization request for a specific resource, including the identity performing the action,
 * the action itself, the resource being accessed, and optional context information.
 *
 * @property {I} entity - The identifier of the entity (e.g., user ID) making the request.
 * @property {A} action - The action being requested (e.g., 'create', 'delete').
 * @property {C} [context] - Optional context related to the request (e.g., user roles, environment metadata).
 * @property {R} resource - The identifier of the resource being accessed (e.g., an object ID or ARN).
 */
export interface AuthorizationRequest<A, I, C, R> {
  /** The identifier of the entity (e.g., user ID) making the request. */
  entity: I;

  /** The action being requested (e.g., 'create', 'delete'). */
  action: A;

  /** Optional context related to the request (e.g., user roles, environment metadata). */
  context?: C;

  /** The identifier of the resource being accessed (e.g., an object ID or ARN). */
  resource: R;
}
