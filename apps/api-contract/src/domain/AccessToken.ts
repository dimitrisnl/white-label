import zod from 'zod';
import * as Either from 'fp-ts/Either';

export const tokenIdValidationSchema = zod.string({
  required_error: 'Token ID is required',
}).uuid({
  message: 'Invalid token ID',
});

const validationSchema = zod.object({
  token: tokenIdValidationSchema,
  type: zod.string(),
  expiresAt: zod.date(),
}).brand('AccessToken');

export type AccessToken = zod.infer<typeof validationSchema>;

export function validate(data: Record<string, any>) {
  return validationSchema.safeParse(data);
}

export function parse(value: unknown): Either.Either<Error, AccessToken> {
  return Either.tryCatch(() => validationSchema.parse(value), Either.toError);
}
