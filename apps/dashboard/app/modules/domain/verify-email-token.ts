import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {ValidationError} from '../errors.server';
import * as DateString from './date';
import * as Uuid from './uuid';

const VerifyEmailTokenBrand = Symbol.for('VerifyEmailTokenBrand');

export const verifyEmailTokenSchema = Schema.struct({
  id: Uuid.uuidSchema,
  userId: Uuid.uuidSchema,
  expiresAt: DateString.dateSchema,
  createdAt: DateString.dateSchema,
  updatedAt: DateString.dateSchema,
}).pipe(Schema.brand(VerifyEmailTokenBrand));

export type VerifyEmailToken = Schema.Schema.To<typeof verifyEmailTokenSchema>;

export function parse(value: unknown) {
  return Effect.try({
    try: () => Schema.parseSync(verifyEmailTokenSchema)(value),
    catch: () => new ValidationError(),
  });
}
