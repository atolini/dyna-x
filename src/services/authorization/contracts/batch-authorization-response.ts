import { AuthorizationResponse } from '.';

/**
 * @interface BatchAuthorizationResponse
 * @template R The type that identifies the resource.
 *
 * @description
 * Represents the result of a batch authorization check, containing the decision for each individual resource.
 *
 * @property {AuthorizationResponse<R>[]} results - An array of authorization responses, each representing the decision for a specific resource.
 */
export interface BatchAuthorizationResponse<R> {
  /** An array of authorization responses, each representing the decision for a specific resource. */
  results: AuthorizationResponse<R>[];
}
