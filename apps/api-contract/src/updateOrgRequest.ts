import * as Org from './domain/Org';
import zod from 'zod';

export interface RequestData {
  name: string;
}

export interface ResponseData {
  org: Org.Org;
}

export const validationSchema = zod.object({
  name: Org.orgNameValidationSchema,
});

export function validate(data: Record<string, any>) {
  return validationSchema.safeParse(data);
}
