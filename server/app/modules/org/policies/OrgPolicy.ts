import {BasePolicy} from '@ioc:Adonis/Addons/Bouncer';

import {Role} from '@/app/constants/Role';
import User from '@/app/modules/user/models/User';

import Org from '../models/Org';

export default class OrgPolicy extends BasePolicy {
  async view(user: User, org: Org) {
    const membership = await user
      .related('orgs')
      .query()
      .where('org_id', org.id)
      .pivotColumns(['role'])
      .first();

    return Boolean(membership);
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
    const hasPermission = isOwner;

    return hasPermission;
  }
}
