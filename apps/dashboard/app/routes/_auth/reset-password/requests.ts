import {client} from '@/lib/client';

const RESET_PASSWORD_ENDPOINT = '/v1/password/reset';
const VERIFY_RESET_PASSWORD_TOKEN_ENDPOINT = '/v1/password/verify';

export function resetPassword(data: FormData) {
  return client.post(RESET_PASSWORD_ENDPOINT, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function verifyResetPasswordToken(token: string) {
  return client.post(
    VERIFY_RESET_PASSWORD_TOKEN_ENDPOINT,
    {data: {token}},
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
}
