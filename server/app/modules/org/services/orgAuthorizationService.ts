import {ExtractActionsForUser} from '@ioc:Adonis/Addons/Bouncer';
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext';

import User from '@/app/modules/user/models/User';

import Org from '../models/Org';
import OrgPolicy from '../policies/OrgPolicy';

export interface OrgAuthorizationService {
  authorize(action: ExtractActionsForUser<User, OrgPolicy>): Promise<void>;
}

export function getOrgAuthorizationService({
  bouncer,
  org,
}: {
  bouncer: HttpContextContract['bouncer'];
  org: Org;
}): OrgAuthorizationService {
  async function authorize(action: ExtractActionsForUser<User, OrgPolicy>) {
    return bouncer.with('OrgPolicy').authorize(action, org);
  }

  return {authorize};
}
