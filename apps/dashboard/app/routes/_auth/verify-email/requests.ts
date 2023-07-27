import {client} from '@/lib/client';

const VERIFY_EMAIL_ENDPOINT = '/v1/email/verify';

export function verifyEmail(verifyToken: string) {
  return client.post(`${VERIFY_EMAIL_ENDPOINT}/${verifyToken}`);
}
