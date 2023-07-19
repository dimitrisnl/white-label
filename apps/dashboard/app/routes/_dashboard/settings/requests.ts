import {client} from '@/lib/client';

const EDIT_USER_ENDPOINT = '/v1/me';
const CHANGE_PASSWORD_ENDPOINT = '/v1/password/change';

export function editUser({token, data}: {data: FormData; token: string}) {
  return client.patch(EDIT_USER_ENDPOINT, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`,
    },
  });
}

export function changePassword({token, data}: {data: FormData; token: string}) {
  return client.patch(CHANGE_PASSWORD_ENDPOINT, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`,
    },
  });
}
