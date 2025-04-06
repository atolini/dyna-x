import {
    VerifiedPermissionsClient,
    IsAuthorizedCommand,
    BatchIsAuthorizedCommand,
    ActionIdentifier,
    EntityIdentifier,
    ContextDefinition,
} from "@aws-sdk/client-verifiedpermissions";

import {
    IAuthorizationService,
    AuthorizationRequest,
    AuthorizationResponse,
    BatchAuthorizationRequest,
    BatchAuthorizationResponse,
} from "./i-authorization-service";


/**
 * Service implementation using Amazon Verified Permissions for authorization checks.
 *
 * @template I Type representing the identity.
 * @template C Type representing the context.
 * @template R Type representing the resource.
 */
export class AVPAuthorizationService implements IAuthorizationService<ActionIdentifier, EntityIdentifier, ContextDefinition, EntityIdentifier> {
    private client: VerifiedPermissionsClient;
    private policyStoreId: string;

    constructor(policyStoreId: string) {
        this.policyStoreId = policyStoreId;
        this.client = new VerifiedPermissionsClient({});
    }

    async isAuthorized(
        request: AuthorizationRequest<ActionIdentifier, EntityIdentifier, ContextDefinition, EntityIdentifier>
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
            decision: response.decision ?? "DENY",
        };
    }
    async batchIsAuthorized(
        request: BatchAuthorizationRequest<
            ActionIdentifier,
            EntityIdentifier,
            ContextDefinition,
            EntityIdentifier
        >
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
                decision: result.decision ?? "DENY",
            })) ?? [];

        return { results };
    }
}
