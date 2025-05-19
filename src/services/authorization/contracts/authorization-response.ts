/**
 * @interface AuthorizationResponse
 * @template R The type that identifies the resource.
 *
 * @description
 * Represents the result of an individual authorization check, indicating whether access
 * to a specific resource is allowed or denied.
 *
 * @property {R} resourceId - The identifier of the resource for which the authorization decision was made.
 * @property {'ALLOW' | 'DENY'} decision - The result of the authorization check.
 */
export interface AuthorizationResponse<R> {
  /** The identifier of the resource for which the authorization decision was made. */
  resourceId: R;

  /** The result of the authorization check. */
  decision: 'ALLOW' | 'DENY';
}
