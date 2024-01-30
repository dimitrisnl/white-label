import type {ParseError} from '@effect/schema/ParseResult';
import * as Schema from '@effect/schema/Schema';
import {Data} from 'effect';
import * as Effect from 'effect/Effect';
import {compose} from 'effect/Function';
import type {memberships, orgs, users} from 'zapatos/schema';

import {db} from '../db/db.server.ts';
import {emailSchema} from './email.server.ts';
import {membershipRoleSchema} from './membership-role.server.ts';
import {orgIdSchema, orgNameSchema, orgSlugSchema} from './org.server.ts';
import {userIdSchema, userNameSchema} from './user.server.ts';

class MembershipParseError extends Data.TaggedError('MembershipParseError')<{
  cause: ParseError;
}> {}

export class Membership extends Schema.Class<Membership>()({
  org: Schema.struct({
    name: orgNameSchema,
    id: orgIdSchema,
    slug: orgSlugSchema,
  }),
  user: Schema.struct({
    name: userNameSchema,
    id: userIdSchema,
    email: emailSchema,
  }),
  role: membershipRoleSchema,
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
}) {
  static fromUnknown = compose(
    Schema.decodeUnknown(this),
    Effect.mapError((cause) => new MembershipParseError({cause}))
  );

  static fromRecord({
    record,
    org,
    user,
  }: {
    record: memberships.JSONSelectable;
    org: Pick<orgs.JSONSelectable, 'id' | 'slug' | 'name'>;
    user: Pick<users.JSONSelectable, 'id' | 'name' | 'email'>;
  }) {
    return Membership.fromUnknown({
      role: record.role,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
      org: {
        id: org.id,
        name: org.name,
        slug: org.slug,
      },
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  }

  getRecord() {
    return {
      role: this.role,
      updated_at: db.toString(this.updatedAt, 'timestamptz'),
      created_at: db.toString(this.createdAt, 'timestamptz'),
      org_id: this.org.id,
      user_id: this.user.id,
    };
  }
}
