import zod from 'zod';

import {E} from '@/utils/fp';

export const OWNER = 'OWNER' as const;
export const ADMIN = 'ADMIN' as const;
export const MEMBER = 'MEMBER' as const;

export const validationSchema = zod
  .enum([OWNER, ADMIN, MEMBER])
  .brand('MembershipRole');

export type MembershipRole = zod.infer<typeof validationSchema>;

export function validate(data: Record<string, unknown>) {
  return validationSchema.safeParse(data);
}

export function parse(value: unknown): E.Either<Error, MembershipRole> {
  return E.tryCatch(() => validationSchema.parse(value), E.toError);
}
