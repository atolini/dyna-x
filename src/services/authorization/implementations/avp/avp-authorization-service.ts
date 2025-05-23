import {
  ActionIdentifier,
  BatchIsAuthorizedCommand,
  BatchIsAuthorizedWithTokenCommand,
  ContextDefinition,
  EntityIdentifier,
  IsAuthorizedCommand,
  IsAuthorizedWithTokenCommand,
  VerifiedPermissionsClient,
  VerifiedPermissionsClientConfig,
} from '@aws-sdk/client-verifiedpermissions';

import {
  AuthorizationRequest,
  AuthorizationResponse,
  BatchAuthorizationRequest,
  BatchAuthorizationResponse,
  IAuthorizationService,
  IAuthorizationServiceEventLogger,
} from '@authorization/contracts';

interface Token {
  accessToken: string;
  identityToken: string;
}

/**
 * @implements {IAuthorizationService<ActionIdentifier, EntityIdentifier, ContextDefinition, EntityIdentifier>}
 * @template ActionIdentifier Type representing the action identifier.
 * @template EntityIdentifier Type representing the entity identifier.
 * @template ContextDefinition Type representing the context definition.
 * @template EntityIdentifier Type representing the resource identifier.
 *
 * Service to manage authorization using AWS Verified Permissions (AVP).
 *
 * Provides methods to check if a principal is authorized for a specific action on a resource.
 *
 * To use this service, you must have a schema and policy store already created in AWS Verified Permissions.
 *
 * If you want to use token-based authorization, you must provide the accessToken and identityToken in the constructor.
 * Your Policy Store must also be configured to use token-based authorization.
 *
 * This service relies on the `@aws-sdk/client-verifiedpermissions` package.
 *
 * This class is stateless and safe to be used concurrently across multiple requests.
 *
 * @example
 * const actionIdentifier: ActionIdentifier = { actionType: 'Action', actionId: 'Read' }; // Example action identifier
 * const entityIdentifier: EntityIdentifier = { entityType: 'User', entityId: 'user-123' }; // Example entity identifier
 * const contextDefinition: ContextDefinition = {
 * "contextMap": {
 *   "key1": {
 *    "bollean": "true"
 *   }
 *  }
 * }; // Example context definition
 * const resourceIdentifier: EntityIdentifier = { entityType: 'Resource', entityId: 'resource-abc' }; // Example resource identifier
 */
export class AVPAuthorizationService
  implements
    IAuthorizationService<
      ActionIdentifier,
      EntityIdentifier,
      ContextDefinition,
      EntityIdentifier
    >
{
  private readonly client: VerifiedPermissionsClient;
  private readonly policyStoreId: string;
  private readonly token: Token | null;
  private readonly eventLogger: IAuthorizationServiceEventLogger<
    ActionIdentifier,
    EntityIdentifier,
    ContextDefinition,
    EntityIdentifier
  >;

  /**
   * Creates an instance of AVPAuthorizationService.
   *
   * @param {string} policyStoreId - The ID of the policy store to be used for authorization checks.
   * @param {IAuthorizationServiceEventLogger} eventLogger -Logger instance responsible for recording events related to authorization checks.
   * @param {Token} [token] - Optional token credentials containing an access token and an identity token.
   * If provided, the service will use token-based authorization for requests.
   * @param {VerifiedPermissionsClientConfig} [clientConfig] - Optional configuration for the VerifiedPermissionsClient.
   *
   * @example
   * // Example without token
   * const service = new AVPAuthorizationService('your-policy-store-id');
   *
   * @example
   * // Example with token
   * const service = new AVPAuthorizationService('your-policy-store-id', {
   *   accessToken: 'your-access-token',
   *   identityToken: 'your-identity-token',
   * });
   */
  constructor(
    policyStoreId: string,
    eventLogger: IAuthorizationServiceEventLogger<
      ActionIdentifier,
      EntityIdentifier,
      ContextDefinition,
      EntityIdentifier
    >,
    token?: Token,
    clientConfig?: VerifiedPermissionsClientConfig,
  ) {
    this.policyStoreId = policyStoreId;
    this.client = new VerifiedPermissionsClient(clientConfig ?? clientConfig);
    this.token = token || null;
    this.eventLogger = eventLogger;
  }

  /**
   * Checks if a principal is authorized for a specific action on a resource.
   *
   * @param request - The authorization request containing the principal, action, resource, and context.
   * @returns A promise that resolves to an authorization response.
   *
   * @example
   * const service = new AVPAuthorizationService('policy-store-id');
   * const request = {
   *   entityId: { entityType: 'User', entityId: 'user-123' },
   *   action: { actionType: 'Action', actionId: 'Read' },
   *   resourceId: { entityType: 'Resource', entityId: 'resource-abc' },
   * };
   * service.isAuthorized(request)
   *   .then(response => console.log(response.decision)) // Outputs: 'ALLOW' or 'DENY'
   *   .catch(error => console.error(error));
   *
   * @throws {ResourceNotFoundException} If the resource does not exist.
   * @throws {AccessDeniedException} If the caller does not have permission to perform the action.
   * @throws {ValidationException} If the request parameters are invalid.
   * @throws {ThrottlingException} If the request is throttled.
   * @throws {InternalServerException} If an internal server error occurs.
   *
   * This function uses the AWS SDK commands:
   * - {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/verifiedpermissions/command/IsAuthorizedCommand/ | IsAuthorizedCommand}
   * - {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/verifiedpermissions/command/IsAuthorizedWithTokenCommand/ | IsAuthorizedWithTokenCommand}
   */
  async isAuthorized(
    request: AuthorizationRequest<
      ActionIdentifier,
      EntityIdentifier,
      ContextDefinition,
      EntityIdentifier
    >,
  ): Promise<AuthorizationResponse<EntityIdentifier>> {
    const { resource: resourceId, entity: entityId, context, action } = request;

    const params = {
      policyStoreId: this.policyStoreId,
      principal: entityId,
      action,
      resource: resourceId,
    };

    if (context) {
      params['context'] = context;
    }

    const command = this.token
      ? new IsAuthorizedWithTokenCommand({
          ...params,
          accessToken: this.token.accessToken,
          identityToken: this.token.identityToken,
        })
      : new IsAuthorizedCommand(params);

    const response = await this.client.send(command);

    const result = {
      resource: request.resource,
      decision: response.decision ?? 'DENY',
    };

    this.eventLogger.authorizationChecked(request, result);

    return result;
  }

  /**
   * Checks if a principal is authorized for multiple actions on multiple resources.
   *
   * @param request - The batch authorization request containing multiple authorization requests.
   * @returns A list with the authorization results as 'ALLOW' or 'DENY' for each request.
   *
   * @example
   * const service = new AVPAuthorizationService('your-policy-store-id');
   * const request = {
   *   requests: [
   *     {
   *       entityId: { entityType: 'User', entityId: 'user-1' },
   *       action: { actionType: 'Action', actionId: 'Read' },
   *       resourceId: { entityType: 'Resource', entityId: 'resource-1' },
   *     },
   *     {
   *       entityId: { entityType: 'User', entityId: 'user-2' },
   *       action: { actionType: 'Action', actionId: 'Write' },
   *       resourceId: { entityType: 'Resource', entityId: 'resource-2' },
   *     },
   *   ],
   * };
   * service.batchIsAuthorized(request)
   *   .then(response => console.log(response.results)) // Outputs: [{ resourceId: { entityType: 'Resource', entityId: 'resource-1' }, decision: 'ALLOW' }, ...]
   *   .catch(error => console.error(error));
   *
   * @throws {ResourceNotFoundException} If the resource does not exist.
   * @throws {AccessDeniedException} If the caller does not have permission to perform the action.
   * @throws {ValidationException} If the request parameters are invalid.
   * @throws {ThrottlingException} If the request is throttled.
   * @throws {InternalServerException} If an internal server error occurs.
   *
   * This function uses the AWS SDK commands:
   * - {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/verifiedpermissions/command/BatchIsAuthorizedCommand/ | BatchIsAuthorizedCommand}
   * - {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/verifiedpermissions/command/BatchIsAuthorizedWithTokenCommand/ | BatchIsAuthorizedWithTokenCommand}
   */
  async batchIsAuthorized(
    request: BatchAuthorizationRequest<
      ActionIdentifier,
      EntityIdentifier,
      ContextDefinition,
      EntityIdentifier
    >,
  ): Promise<BatchAuthorizationResponse<EntityIdentifier>> {
    const requests = request.requests.map((r) => {
      const { resource: resourceId, entity: entityId, context, action } = r;

      return {
        principal: entityId,
        action,
        resource: resourceId,
        context,
      };
    });

    const command = this.token
      ? new BatchIsAuthorizedWithTokenCommand({
          policyStoreId: this.policyStoreId,
          accessToken: this.token.accessToken,
          identityToken: this.token.identityToken,
          requests,
        })
      : new BatchIsAuthorizedCommand({
          policyStoreId: this.policyStoreId,
          requests,
        });

    const response = await this.client.send(command);

    const results: AuthorizationResponse<EntityIdentifier>[] =
      response.results?.map((result, index) => ({
        resource: request.requests[index].resource,
        decision: result.decision ?? 'DENY',
      })) ?? [];

    const result = { results };

    this.eventLogger.batchAuthorizationChecked(request, result);

    return result;
  }
}
