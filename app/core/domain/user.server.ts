import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {DbRecordParseError} from '../lib/errors.server.ts';
import * as DateString from './date.server.ts';
import * as Email from './email.server.ts';
import * as Uuid from './uuid.server.ts';

const UserBrand = Symbol.for('UserBrand');
const UserIdBrand = Symbol.for('UserIdBrand');

class ParseUserIdError {
  readonly _tag = 'ParseUserIdError';
}

class ParseUserError {
  readonly _tag = 'ParseUserError';
}

export const userNameSchema = Schema.string.pipe(
  Schema.trim,
  Schema.minLength(2, {
    message: () => 'Name must be at least 2 characters',
  }),
  Schema.maxLength(100, {
    message: () => 'Name cannot be more than 120 characters',
  })
);

export const userIdSchema = Uuid.uuidSchema.pipe(Schema.brand(UserIdBrand));

export const userSchema = Schema.struct({
  id: userIdSchema,
  name: userNameSchema,
  email: Email.emailSchema,
  emailVerified: Schema.boolean,
  createdAt: DateString.dateSchema,
  updatedAt: DateString.dateSchema,
}).pipe(Schema.brand(UserBrand));

export type User = Schema.Schema.To<typeof userSchema>;

export function parse(value: unknown) {
  return Effect.try({
    try: () => Schema.parseSync(userSchema)(value),
    catch: () => new ParseUserError(),
  });
}

export function parseId(value: unknown) {
  return Effect.try({
    try: () => Schema.parseSync(userIdSchema)(value),
    catch: () => new ParseUserIdError(),
  });
}

export function dbRecordToDomain(entity: {
  id: string;
  name: string;
  email: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}) {
  return parse({
    id: entity.id,
    name: entity.name,
    email: entity.email,
    emailVerified: entity.email_verified,
    createdAt: entity.created_at,
    updatedAt: entity.updated_at,
  }).pipe(Effect.catchAll(() => Effect.fail(new DbRecordParseError())));
}
