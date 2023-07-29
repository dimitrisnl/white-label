import zod from 'zod';

export interface RequestData {
  token: string;
}

export interface ResponseData {}

export const validationSchema = zod.object({
  token: zod.string().uuid(),
});

export function validate(data: Record<string, any>) {
  return validationSchema.safeParse(data);
}
