import zod from 'zod';

export const validationSchema = zod.string({
  required_error: 'Email is required',
}).email({
  message: 'Invalid email address',
});

export function validate(data: Record<string, any>) {
  return validationSchema.safeParse(data);
}

export type Email = zod.infer<typeof validationSchema>;