import {client} from '@/lib/client';

const FORGOT_PASSWORD_ENDPOINT = '/v1/password/forgot';

export function forgotPassword(data: FormData) {
  return client.post(FORGOT_PASSWORD_ENDPOINT, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
