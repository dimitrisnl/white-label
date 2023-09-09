import * as Effect from 'effect/Effect';
import zod from 'zod';

import {ValidationError} from '../errors.server';

export const OWNER = 'OWNER' as const;
export const ADMIN = 'ADMIN' as const;
export const MEMBER = 'MEMBER' as const;

export const validationSchema = zod
  .enum([OWNER, ADMIN, MEMBER])
  .brand('MembershipRole');

export type MembershipRole = zod.infer<typeof validationSchema>;

export function parse(value: unknown) {
  return Effect.try({
    try: () => validationSchema.parse(value),
    catch: () => new ValidationError(),
  });
}
