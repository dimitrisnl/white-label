import type {getOrgRequest, updateOrgRequest} from 'api-contract';

import {client} from '@/lib/client';

const GET_ORG_ENDPOINT = '/v1/orgs';
const EDIT_ORG_ENDPOINT = '/v1/orgs';

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
