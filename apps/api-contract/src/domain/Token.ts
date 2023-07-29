import zod from 'zod';

export interface Token {
  type: string;
  token: string;
  expiresAt?: string;
}

export const tokenIdValidationSchema = zod.string({
  required_error: 'Token ID is required',
}).uuid({
  message: 'Invalid token ID',
});