import type {loginRequest} from 'api-contract';

import {client} from '@/lib/client';

const LOGIN_ENDPOINT = '/v1/auth/login';

export async function login(data: loginRequest.RequestData) {
  return client.post<loginRequest.ResponseData>(LOGIN_ENDPOINT, data);
}
