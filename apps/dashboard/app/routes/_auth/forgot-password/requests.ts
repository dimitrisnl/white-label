import type {requestPasswordResetRequest} from 'api-contract';

import {client} from '@/lib/client';

const FORGOT_PASSWORD_ENDPOINT = '/v1/password/forgot';

export function forgotPassword(data: requestPasswordResetRequest.RequestData) {
  return client.post<requestPasswordResetRequest.ResponseData>(
    FORGOT_PASSWORD_ENDPOINT,
    data
  );
}
