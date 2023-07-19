import {client} from '@/lib/client';

const LOGIN_ENDPOINT = '/v1/auth/login';

export interface Token {
  type: string;
  token: string;
  expiresAt?: string;
}

export async function login(data: FormData) {
  return client.post<{
    token: Token;
  }>(LOGIN_ENDPOINT, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
