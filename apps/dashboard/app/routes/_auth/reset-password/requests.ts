import type {
  resetPasswordRequest,
  validatePasswordResetRequest,
} from 'api-contract';

import {client} from '@/lib/client';

const RESET_PASSWORD_ENDPOINT = '/v1/password/reset';
const VERIFY_RESET_PASSWORD_TOKEN_ENDPOINT = '/v1/password/verify';

export function resetPassword(data: resetPasswordRequest.RequestData) {
  return client.post<resetPasswordRequest.ResponseData>(
    RESET_PASSWORD_ENDPOINT,
    data
  );
}

export function verifyResetPasswordToken(
  data: validatePasswordResetRequest.RequestData
) {
  return client.post<validatePasswordResetRequest.ResponseData>(
    VERIFY_RESET_PASSWORD_TOKEN_ENDPOINT,
    data
  );
}
