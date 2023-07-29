import type {registerRequest} from 'api-contract';

import {client} from '@/lib/client';

const REGISTER_ENDPOINT = '/v1/auth/register';

export async function register(data: registerRequest.RequestData) {
  return client.post<registerRequest.ResponseData>(REGISTER_ENDPOINT, data);
}
