import {Token, User} from './domain';
import zod from 'zod';

export interface RequestData {
  name: string;
  email: string;
  password: string;
}

export interface ResponseData {
  token: Token;
  user: User;
}

export const validationSchema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(8),
  name: zod.string(),
});

export function validate(data: Record<string, any>) {
  return validationSchema.safeParse(data);
}
