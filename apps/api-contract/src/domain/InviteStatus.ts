import zod from 'zod';
import * as Either from 'fp-ts/Either';

export const PENDING = 'PENDING' as const;
export const ACCEPTED = 'ACCEPTED' as const;
export const DECLINED = 'DECLINED' as const;
export const EXPIRED = 'EXPIRED' as const;

export const validationSchema = zod.enum([PENDING, ACCEPTED, DECLINED, EXPIRED]).brand('InviteStatus');

export type InviteStatus = zod.infer<typeof validationSchema>;

export function validate(data: Record<string, any>) {
  return validationSchema.safeParse(data);
}

export function parse(value: unknown): Either.Either<Error, InviteStatus> {
  return Either.tryCatch(() => validationSchema.parse(value), Either.toError);
}