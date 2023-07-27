import type {changePasswordRequest, editUserRequest} from 'api-contract';

import {client} from '@/lib/client';

const EDIT_USER_ENDPOINT = '/v1/me';
const CHANGE_PASSWORD_ENDPOINT = '/v1/password/change';

export function editUser({
  token,
  data,
}: {
  data: editUserRequest.RequestData;
  token: string;
}) {
  return client.patch<editUserRequest.ResponseData>(EDIT_USER_ENDPOINT, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function changePassword({
  token,
  data,
}: {
  data: changePasswordRequest.RequestData;
  token: string;
}) {
  return client.patch<changePasswordRequest.ResponseData>(
    CHANGE_PASSWORD_ENDPOINT,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
