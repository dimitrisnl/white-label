import zod from 'zod';
import * as Either from 'fp-ts/Either';

export const validationSchema = zod.string({
  required_error: 'Password is required',
}).min(8, {
  message: 'Password must be at least 8 characters',
}).brand('Password');

export type Password = zod.infer<typeof validationSchema>;

export function validate(data: Record<string, any>) {
  return validationSchema.safeParse(data);
}

export function parse(value: unknown): Either.Either<Error, Password> {
  return Either.tryCatch(() => validationSchema.parse(value), Either.toError);
}