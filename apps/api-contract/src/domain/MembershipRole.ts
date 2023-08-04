import zod from 'zod';
import * as Either from 'fp-ts/Either';

export const OWNER = 'OWNER' as const;
export const ADMIN = 'ADMIN' as const;
export const MEMBER = 'MEMBER' as const;

export const validationSchema = zod.enum([OWNER, ADMIN, MEMBER]).brand('MembershipRole');

export type MembershipRole = zod.infer<typeof validationSchema>;

export function validate(data: Record<string, any>) {
  return validationSchema.safeParse(data);
}

export function parse(value: unknown): Either.Either<Error, MembershipRole> {
  return Either.tryCatch(() => validationSchema.parse(value), Either.toError);
}