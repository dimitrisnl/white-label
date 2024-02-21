import type {ParseError} from '@effect/schema/ParseResult';
import * as Schema from '@effect/schema/Schema';
import {Data, Effect} from 'effect';
import {compose} from 'effect/Function';
import type {users} from 'zapatos/schema';

import {db} from '~/core/db/schema.server.ts';

import {emailSchema} from './email.server.ts';
import {uuidSchema} from './uuid.server.ts';

class UserIdParseError extends Data.TaggedError('UserIdParseError')<{
  cause: ParseError;
}> {}

class UserParseError extends Data.TaggedError('UserParseError')<{
  cause: ParseError;
}> {}

export const userNameSchema = Schema.Trim.pipe(
  Schema.minLength(2, {
    message: () => 'Name must be at least 2 characters',
  }),
  Schema.maxLength(100, {
    message: () => 'Name cannot be more than 100 characters',
  })
);

const UserIdBrand = Symbol.for('UserIdBrand');
export const userIdSchema = uuidSchema.pipe(Schema.brand(UserIdBrand));

export class User extends Schema.Class<User>()({
  id: userIdSchema,
  name: userNameSchema,
  email: emailSchema,
  emailVerified: Schema.boolean,
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
}) {
  static fromUnknown = compose(
    Schema.decodeUnknown(this),
    Effect.mapError((cause) => new UserParseError({cause}))
  );

  static fromRecord(record: users.JSONSelectable) {
    return User.fromUnknown({
      id: record.id,
      name: record.name,
      email: record.email,
      emailVerified: record.email_verified,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    });
  }

  getRecord() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      email_verified: this.emailVerified,
      updated_at: db.toString(this.updatedAt, 'timestamptz'),
      created_at: db.toString(this.createdAt, 'timestamptz'),
    };
  }
}

export const parseUserId = compose(
  Schema.decodeUnknown(userIdSchema),
  Effect.mapError((cause) => new UserIdParseError({cause}))
);
