import zod from 'zod';

export interface RequestData {
  token: string;
  password: string;
}

export interface ResponseData {}

export const validationSchema = zod.object({
  password: zod.string().min(8),
  token: zod.string().uuid(),
});

export function validate(data: Record<string, any>) {
  return validationSchema.safeParse(data);
}
