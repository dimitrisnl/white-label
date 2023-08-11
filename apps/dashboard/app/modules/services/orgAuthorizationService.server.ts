import {db, pool} from '@/database/db.server';
import type {Org, User} from '@/modules/domain/index.server';
import {MembershipRole} from '@/modules/domain/index.server';

export const orgAuthorizationService = {
  async canView(userId: User.User['id'], orgId: Org.Org['id']) {
    const membershipRecord = await db
      .selectOne('memberships', {
        org_id: orgId,
        user_id: userId,
      })
      .run(pool);

    return Boolean(membershipRecord);
  },

  async canUpdate(userId: User.User['id'], orgId: Org.Org['id']) {
    const membershipRecord = await db
      .selectOne('memberships', {
        org_id: orgId,
        user_id: userId,
      })
      .run(pool);

    if (!membershipRecord) {
      return false;
    }

    const role = membershipRecord.role;
    const isOwner = role === MembershipRole.OWNER;
    const isAdmin = role === MembershipRole.ADMIN;
    const hasPermission = isOwner || isAdmin;

    return hasPermission;
  },

  async canDelete(userId: User.User['id'], orgId: Org.Org['id']) {
    const membershipRecord = await db
      .selectOne('memberships', {
        org_id: orgId,
        user_id: userId,
      })
      .run(pool);

    if (!membershipRecord) {
      return false;
    }

    const role = membershipRecord.role;
    const isOwner = role === MembershipRole.OWNER;
    const hasPermission = isOwner;

    return hasPermission;
  },
};
