import {client} from '@/lib/client';

const GET_ORG_ENDPOINT = '/v1/orgs';
const EDIT_ORG_ENDPOINT = '/v1/orgs';

export function getOrg({token, orgId}: {token: string; orgId: string}) {
  return client.get(GET_ORG_ENDPOINT, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-org-id': orgId,
    },
  });
}

export function editOrg({
  token,
  data,
  orgId,
}: {
  token: string;
  data: FormData;
  orgId: string;
}) {
  return client.patch(EDIT_ORG_ENDPOINT, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`,
      'x-org-id': orgId,
    },
  });
}
