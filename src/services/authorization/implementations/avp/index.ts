import {
  VerifiedPermissionsClient,
  IsAuthorizedCommand,
  BatchIsAuthorizedCommand,
  ActionIdentifier,
  EntityIdentifier,
  ContextDefinition,
} from '@aws-sdk/client-verifiedpermissions';

import {
  IAuthorizationService,
  AuthorizationRequest,
  AuthorizationResponse,
  BatchAuthorizationRequest,
  BatchAuthorizationResponse,
} from '../../contracts';

/**
 * Service implementation using Amazon Verified Permissions for authorization checks.
 *
 * @template I Type representing the identity.
 * @template C Type representing the context.
 * @template R Type representing the resource.
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
  private client: VerifiedPermissionsClient;
  private policyStoreId: string;

  constructor(policyStoreId: string) {
    this.policyStoreId = policyStoreId;
    this.client = new VerifiedPermissionsClient({});
  }

  /**
   * Checks if a principal is authorized for a specific action on a resource.
   *
   * @param request - The authorization request containing the principal, action, resource, and context.
   * @returns A promise that resolves to an authorization response.
   */
  async isAuthorized(
    request: AuthorizationRequest<
      ActionIdentifier,
      EntityIdentifier,
      ContextDefinition,
      EntityIdentifier
    >,
  ): Promise<AuthorizationResponse<EntityIdentifier>> {
    const { resourceId, entityId, context, action } = request;

    const command = new IsAuthorizedCommand({
      policyStoreId: this.policyStoreId,
      principal: entityId,
      action,
      resource: resourceId,
      context: context,
    });

    const response = await this.client.send(command);

    return {
      recourseId: request.resourceId,
      decision: response.decision ?? 'DENY',
    };
  }

  /**
   * Checks if a principal is authorized for multiple actions on multiple resources.
   *
   * @param request - The batch authorization request containing multiple authorization requests.
   * @returns A promise that resolves to a batch authorization response.
   */
  async batchIsAuthorized(
    request: BatchAuthorizationRequest<
      ActionIdentifier,
      EntityIdentifier,
      ContextDefinition,
      EntityIdentifier
    >,
  ): Promise<BatchAuthorizationResponse<EntityIdentifier>> {
    const command = new BatchIsAuthorizedCommand({
      policyStoreId: this.policyStoreId,
      requests: request.requests.map((r) => {
        const { resourceId, entityId, context, action } = r;

        return {
          principal: entityId,
          action,
          resource: resourceId,
          context,
        };
      }),
    });

    const response = await this.client.send(command);

    const results: AuthorizationResponse<EntityIdentifier>[] =
      response.results?.map((result, index) => ({
        recourseId: request.requests[index].resourceId,
        decision: result.decision ?? 'DENY',
      })) ?? [];

    return { results };
  }
}
