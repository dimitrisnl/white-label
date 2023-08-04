import zod from 'zod';
import * as Uuid from './Uuid';
import * as Either from 'fp-ts/Either';

const validationSchema = zod.object({
  id: Uuid.validationSchema,
  userId: Uuid.validationSchema,
  expiresAt: zod.date(),
  createdAt: zod.date(),
  updatedAt: zod.date(),
}).brand('VerifyEmailToken');

export type VerifyEmailToken = zod.infer<typeof validationSchema>;

export function validate(data: Record<string, any>) {
  return validationSchema.safeParse(data);
}

export function parse(value: unknown): Either.Either<Error, VerifyEmailToken> {
  return Either.tryCatch(() => validationSchema.parse(value), Either.toError);
}