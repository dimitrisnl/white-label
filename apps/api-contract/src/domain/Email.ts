import zod from 'zod';
import * as Either from 'fp-ts/Either';

export const validationSchema = zod.string({
  required_error: 'Email is required',
}).email({
  message: 'Invalid email address',
});

export type Email = zod.infer<typeof validationSchema>;


export function validate(data: Record<string, any>) {
  return validationSchema.safeParse(data);
}

export function parse(value: unknown): Either.Either<Error, Email> {
  return Either.tryCatch(() => validationSchema.parse(value), Either.toError);
}