import zod from 'zod';

export interface RequestData {
  oldPassword: string;
  newPassword: string;
}

export interface ResponseData {}

export const validationSchema = zod.object({
  oldPassword: zod.string().min(8),
  newPassword: zod.string().min(8),
});

export function validate(data: unknown) {
  return validationSchema.safeParse(data);
}
