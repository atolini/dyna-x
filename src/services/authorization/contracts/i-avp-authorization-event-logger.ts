import {
  ActionIdentifier,
  EntityIdentifier,
  ContextDefinition,
} from '@aws-sdk/client-verifiedpermissions';
import {
  AuthorizationRequest,
  AuthorizationResponse,
  BatchAuthorizationRequest,
  BatchAuthorizationResponse,
} from '.';

/**
 * @interface IAVPAuthorizationEventLogger
 *
 * @description
 * Defines the contract for an event logger that tracks authorization checks made via AWS Verified Permissions.
 *
 * This interface supports logging of both single and batch authorization decisions.
 */
export interface IAVPAuthorizationEventLogger {
  /**
   * Logs a single authorization decision.
   *
   * @param request - The authorization request sent to AVP.
   * @param response - The response received from AVP containing the decision.
   */
  authorizationChecked(
    request: AuthorizationRequest<
      ActionIdentifier,
      EntityIdentifier,
      ContextDefinition,
      EntityIdentifier
    >,
    response: AuthorizationResponse<EntityIdentifier>,
  ): void;

  /**
   * Logs a batch of authorization decisions.
   *
   * @param request - The batch of authorization requests sent to AVP.
   * @param response - The batch response from AVP containing decisions for each request.
   */
  batchAuthorizationChecked(
    request: BatchAuthorizationRequest<
      ActionIdentifier,
      EntityIdentifier,
      ContextDefinition,
      EntityIdentifier
    >,
    response: BatchAuthorizationResponse<EntityIdentifier>,
  ): void;
}
