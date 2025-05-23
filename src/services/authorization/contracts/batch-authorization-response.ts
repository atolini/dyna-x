import { AuthorizationResponse } from '.';

/**
 * Represents the result of a batch authorization check, containing the decision for each individual resource.
 * 
 * @template R The type that identifies the resource.
 *
 * @property {AuthorizationResponse<R>[]} results - An array of authorization responses, each representing the decision for a specific resource.
 */
export interface BatchAuthorizationResponse<R> {
  /** An array of authorization responses, each representing the decision for a specific resource. */
  results: AuthorizationResponse<R>[];
}
