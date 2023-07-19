import {BasePolicy} from '@ioc:Adonis/Addons/Bouncer';

import {Role} from '@/app/constants/Role';
import Org from '@/app/modules/org/models/Org';
import User from '@/app/modules/user/models/User';

export default class MemberInvitationPolicy extends BasePolicy {
  async viewList(user: User, org: Org) {
    const membership = await user
      .related('orgs')
      .query()
      .where('org_id', org.id)
      .pivotColumns(['role'])
      .first();

    return Boolean(membership);
  }
  async view(user: User, org: Org) {
    const membership = await user
      .related('orgs')
      .query()
      .where('org_id', org.id)
      .pivotColumns(['role'])
      .first();

    return Boolean(membership);
  }
  async create(user: User, org: Org) {
    const membership = await user
      .related('orgs')
      .query()
      .where('org_id', org.id)
      .pivotColumns(['role'])
      .first();

    if (!membership) {
      return false;
    }

    const role = membership.$extras.pivot_role as Role;
    const isOwner = role === Role.OWNER;
    const isAdmin = role === Role.ADMIN;
    const hasPermission = isOwner || isAdmin;

    return hasPermission;
  }
  async update(user: User, org: Org) {
    const membership = await user
      .related('orgs')
      .query()
      .where('org_id', org.id)
      .pivotColumns(['role'])
      .first();

    if (!membership) {
      return false;
    }

    const role = membership.$extras.pivot_role as Role;
    const isOwner = role === Role.OWNER;
    const isAdmin = role === Role.ADMIN;
    const hasPermission = isOwner || isAdmin;

    return hasPermission;
  }
  async delete(user: User, org: Org) {
    const membership = await user
      .related('orgs')
      .query()
      .where('org_id', org.id)
      .pivotColumns(['role'])
      .first();

    if (!membership) {
      return false;
    }

    const role = membership.$extras.pivot_role as Role;
    const isOwner = role === Role.OWNER;
    const isAdmin = role === Role.ADMIN;
    const hasPermission = isOwner || isAdmin;

    return hasPermission;
  }
}
