import type {ParseError} from '@effect/schema/ParseResult';
import * as Schema from '@effect/schema/Schema';
import {Data, Effect} from 'effect';
import {compose} from 'effect/Function';
import type {membership_invitations, orgs} from 'zapatos/schema';

import {db} from '../db/schema.server.ts';
import {emailSchema} from './email.server.ts';
import {inviteStatusSchema} from './invite-status.server.ts';
import {membershipRoleSchema} from './membership-role.server.ts';
import {orgIdSchema, orgNameSchema, orgSlugSchema} from './org.server.ts';
import {uuidSchema} from './uuid.server.ts';

class MembershipInvitationParse extends Data.TaggedError(
  'MembershipInvitationParse'
)<{
  cause: ParseError;
}> {}

export class MembershipInvitation extends Schema.Class<MembershipInvitation>(
  'MembershipInvitation'
)({
  id: uuidSchema,
  email: emailSchema,
  status: inviteStatusSchema,
  role: membershipRoleSchema,
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
  org: Schema.Struct({
    name: orgNameSchema,
    id: orgIdSchema,
    slug: orgSlugSchema,
  }),
}) {
  static fromUnknown = compose(
    Schema.decodeUnknown(this),
    Effect.mapError((cause) => new MembershipInvitationParse({cause}))
  );

  static fromRecord({
    record,
    org,
  }: {
    record: membership_invitations.JSONSelectable;
    org: Pick<orgs.JSONSelectable, 'id' | 'slug' | 'name'>;
  }) {
    return MembershipInvitation.fromUnknown({
      id: record.id,
      email: record.email,
      status: record.status,
      role: record.role,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
      org: {
        id: org.id,
        name: org.name,
        slug: org.slug,
      },
    });
  }

  getRecord() {
    return {
      id: this.id,
      email: this.email,
      status: this.status,
      role: this.role,
      org_id: this.org.id,
      updated_at: db.toString(this.updatedAt, 'timestamptz'),
      created_at: db.toString(this.createdAt, 'timestamptz'),
    };
  }
}
