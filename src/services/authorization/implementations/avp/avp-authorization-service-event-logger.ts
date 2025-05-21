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
  IAuthorizationServiceEventLogger,
} from '@authorization/contracts';
import { ILogger } from '@logger/contracts';

/**
 * @class AVPAuthorizationEventLogger
 * @implements IAuthorizationServiceEventLogger
 *
 * @classdesc
 * Logger utility for tracking authorization events within the {@link AVPAuthorizationService}.
 *
 * Logs single and batch authorization checks with relevant request and decision details.
 *
 * Useful for auditing and debugging access control decisions made via AWS Verified Permissions.
 *
 * @example
 * const logger = new ConsoleLogger(); // implements ILogger
 * const eventLogger = new AVPAuthorizationEventLogger(logger, 'store-id');
 * eventLogger.authorizationChecked(request, response);
 */
export class AVPAuthorizationServiceEventLogger
  implements
    IAuthorizationServiceEventLogger<
      ActionIdentifier,
      EntityIdentifier,
      ContextDefinition,
      EntityIdentifier
    >
{
  private readonly logger: ILogger<unknown>;
  private readonly policyStoreId: string;

  /**
   * Creates an instance of AVPAuthorizationEventLogger.
   *
   * @param {ILogger<unknown>} logger - Logger implementation to output structured events.
   * @param {string} policyStoreId - The ID of the AVP policy store used in authorization checks.
   */
  constructor(logger: ILogger<unknown>, policyStoreId: string) {
    this.logger = logger;
    this.policyStoreId = policyStoreId;
  }

  /**
   * Logs a single authorization decision.
   *
   * @param {AuthorizationRequest<ActionIdentifier, EntityIdentifier, ContextDefinition, EntityIdentifier>} request
   * The authorization request sent to AVP.
   *
   * @param {AuthorizationResponse<EntityIdentifier>} response
   * The response received from AVP containing the decision.
   */
  public authorizationChecked(
    request: AuthorizationRequest<
      ActionIdentifier,
      EntityIdentifier,
      ContextDefinition,
      EntityIdentifier
    >,
    response: AuthorizationResponse<EntityIdentifier>,
  ) {
    this.logger.info({
      message: 'Authorization Checked',
      policyStoreId: this.policyStoreId,
      request,
      result: response,
    });
  }

  /**
   * Logs a batch of authorization decisions.
   *
   * @param {BatchAuthorizationRequest<ActionIdentifier, EntityIdentifier, ContextDefinition, EntityIdentifier>} request
   * The batch of authorization requests sent to AVP.
   *
   * @param {BatchAuthorizationResponse<EntityIdentifier>} response
   * The batch response from AVP containing decisions for each request.
   */
  public batchAuthorizationChecked(
    request: BatchAuthorizationRequest<
      ActionIdentifier,
      EntityIdentifier,
      ContextDefinition,
      EntityIdentifier
    >,
    response: BatchAuthorizationResponse<EntityIdentifier>,
  ) {
    this.logger.info({
      message: 'Batch Authorization Checked',
      policyStoreId: this.policyStoreId,
      request,
      result: response,
    });
  }
}
