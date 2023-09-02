import * as Effect from 'effect/Effect';
import zod from 'zod';

import {ValidationError} from '../errors.server';

export const PENDING = 'PENDING' as const;
export const ACCEPTED = 'ACCEPTED' as const;
export const DECLINED = 'DECLINED' as const;
export const EXPIRED = 'EXPIRED' as const;

export const validationSchema = zod
  .enum([PENDING, ACCEPTED, DECLINED, EXPIRED])
  .brand('InviteStatus');

export type InviteStatus = zod.infer<typeof validationSchema>;

export function parse(value: unknown) {
  return Effect.try({
    try: () => validationSchema.parse(value),
    catch: () => new ValidationError(),
  });
}
