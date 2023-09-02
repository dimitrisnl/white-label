import zod from 'zod';

import {E} from '@/utils/fp';

export const PENDING = 'PENDING' as const;
export const ACCEPTED = 'ACCEPTED' as const;
export const DECLINED = 'DECLINED' as const;
export const EXPIRED = 'EXPIRED' as const;

export const validationSchema = zod
  .enum([PENDING, ACCEPTED, DECLINED, EXPIRED])
  .brand('InviteStatus');

export type InviteStatus = zod.infer<typeof validationSchema>;

export function validate(data: Record<string, unknown>) {
  return validationSchema.safeParse(data);
}

export function parse(value: unknown): E.Either<Error, InviteStatus> {
  return E.tryCatch(() => validationSchema.parse(value), E.toError);
}
