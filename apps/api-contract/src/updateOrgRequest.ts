import {Org} from './domain';
import zod from 'zod';

export interface RequestData {
  name: string;
}

export interface ResponseData {
  org: Org;
}

export const validationSchema = zod.object({
  name: zod.string(),
});

export function validate(data: Record<string, any>) {
  return validationSchema.safeParse(data);
}
