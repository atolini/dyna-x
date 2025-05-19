import { mockClient } from 'aws-sdk-client-mock';
import {
  VerifiedPermissionsClient,
  IsAuthorizedCommand,
  EntityIdentifier,
  ActionIdentifier,
  ContextDefinition,
  BatchIsAuthorizedCommand,
} from '@aws-sdk/client-verifiedpermissions';
import {
  AuthorizationRequest,
  BatchAuthorizationRequest,
} from '../../contracts';
import { AVPAuthorizationService } from './avp-authorization-service';
import { AVPAuthorizationEventLogger } from './avp-authorization-event-logger';
import { Logger } from '../../../../utils/logger/implementations';

const vpClientMock = mockClient(VerifiedPermissionsClient);

describe('AmazonVerifiedPermissionsService - isAuthorized', () => {
  const policyStoreId = 'test-policy-store';

  const service = new AVPAuthorizationService(
    policyStoreId,
    new AVPAuthorizationEventLogger(
      new Logger({
        requestId: 'request-id',
        service: 'service-1',
      }),
      policyStoreId,
    ),
  );

  beforeEach(() => {
    vpClientMock.reset();
  });

  it('should return ALLOW decision', async () => {
    const request: AuthorizationRequest<
      ActionIdentifier,
      EntityIdentifier,
      ContextDefinition,
      EntityIdentifier
    > = {
      entityId: { entityType: 'User', entityId: 'user-123' },
      action: { actionType: 'Action', actionId: 'Read' },
      resourceId: { entityType: 'Resource', entityId: 'resource-abc' },
    };

    vpClientMock.on(IsAuthorizedCommand).resolves({
      decision: 'ALLOW',
    });

    const response = await service.isAuthorized(request);

    expect(response).toEqual({
      recourseId: { entityType: 'Resource', entityId: 'resource-abc' },
      decision: 'ALLOW',
    });

    expect(vpClientMock.calls()).toHaveLength(1);
    expect(vpClientMock.commandCalls(IsAuthorizedCommand)).toHaveLength(1);
  });

  it('should default to DENY if decision is undefined', async () => {
    const request: AuthorizationRequest<
      ActionIdentifier,
      EntityIdentifier,
      ContextDefinition,
      EntityIdentifier
    > = {
      entityId: { entityType: 'User', entityId: 'user-456' },
      action: { actionType: 'Action', actionId: 'Delete' },
      resourceId: { entityType: 'Resource', entityId: 'resource-def' },
    };

    vpClientMock.on(IsAuthorizedCommand).resolves({});

    const response = await service.isAuthorized(request);

    expect(response).toEqual({
      recourseId: { entityType: 'Resource', entityId: 'resource-def' },
      decision: 'DENY',
    });
  });

  it('should return decisions for multiple requests', async () => {
    const request: BatchAuthorizationRequest<
      ActionIdentifier,
      EntityIdentifier,
      ContextDefinition,
      EntityIdentifier
    > = {
      requests: [
        {
          entityId: { entityType: 'User', entityId: 'user-1' },
          action: { actionType: 'Action', actionId: 'Read' },
          resourceId: { entityType: 'Resource', entityId: 'resource-1' },
        },
        {
          entityId: { entityType: 'User', entityId: 'user-2' },
          action: { actionType: 'Action', actionId: 'Write' },
          resourceId: { entityType: 'Resource', entityId: 'resource-2' },
        },
      ],
    };

    vpClientMock.on(BatchIsAuthorizedCommand).resolves({
      results: [
        {
          decision: 'ALLOW',
          determiningPolicies: [],
          errors: [],
          request: {},
        },
        {
          decision: 'DENY',
          determiningPolicies: [],
          errors: [],
          request: {},
        },
      ],
    });

    const response = await service.batchIsAuthorized(request);

    expect(response.results).toEqual([
      {
        recourseId: { entityType: 'Resource', entityId: 'resource-1' },
        decision: 'ALLOW',
      },
      {
        recourseId: { entityType: 'Resource', entityId: 'resource-2' },
        decision: 'DENY',
      },
    ]);

    expect(vpClientMock.commandCalls(BatchIsAuthorizedCommand)).toHaveLength(1);
  });
});
