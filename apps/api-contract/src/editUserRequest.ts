import {User} from './domain';
import zod from 'zod';

export interface RequestData {
  name: string;
}

export interface ResponseData {
  user: User;
}

export const validationSchema = zod.object({
  name: zod.string(),
});

export function validate(data: Record<string, any>) {
  return validationSchema.safeParse(data);
}
