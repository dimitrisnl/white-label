import {client} from '@/lib/client';

const REGISTER_ENDPOINT = '/v1/auth/register';

export interface RegisterResponse {
  user: {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
  };
  token: {
    type: string;
    token: string;
    expiresAt?: string;
  };
}

export async function register(data: FormData) {
  return client.post(REGISTER_ENDPOINT, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
