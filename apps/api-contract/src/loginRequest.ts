import {Token} from './domain';
import zod from 'zod';

export interface RequestData {
  email: string;
  password: string;
}

export interface ResponseData {
  token: Token;
}

export const validationSchema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(8),
});

export function validate(data: unknown) {
  return validationSchema.safeParse(data);
}
