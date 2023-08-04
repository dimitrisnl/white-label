import type {
  createMembershipInvitationRequest,
  getMembershipInvitationsRequest,
  getOrgRequest,
  updateOrgRequest,
} from 'api-contract';

import {client} from '@/lib/client';

const GET_ORG_ENDPOINT = '/v1/orgs';
const EDIT_ORG_ENDPOINT = '/v1/orgs';
const GET_MEMBERSHIP_INVITATIONS_ENDPOINT = 'v1/membership-invitations/';
const CREATE_MEMBERSHIP_INVITATIONS_ENDPOINT = 'v1/membership-invitations/';

export function getOrg({token, orgId}: {token: string; orgId: string}) {
  return client.get<getOrgRequest.ResponseData>(GET_ORG_ENDPOINT, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-org-id': orgId,
    },
  });
}

export function editOrg({
  token,
  orgId,
  data,
}: {
  token: string;
  orgId: string;
  data: updateOrgRequest.RequestData;
}) {
  return client.patch<updateOrgRequest.ResponseData>(EDIT_ORG_ENDPOINT, data, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-org-id': orgId,
    },
  });
}

export function getMembershipInvitations({
  token,
  orgId,
}: {
  token: string;
  orgId: string;
}) {
  return client.get<getMembershipInvitationsRequest.ResponseData>(
    GET_MEMBERSHIP_INVITATIONS_ENDPOINT,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-org-id': orgId,
      },
    }
  );
}

export function createMembershipInvitation({
  token,
  orgId,
  data,
}: {
  token: string;

  orgId: string;
  data: createMembershipInvitationRequest.RequestData;
}) {
  return client.post<createMembershipInvitationRequest.ResponseData>(
    CREATE_MEMBERSHIP_INVITATIONS_ENDPOINT,
    data,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-org-id': orgId,
      },
    }
  );
}
