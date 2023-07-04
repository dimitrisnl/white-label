import {ExtractActionsForUser} from '@ioc:Adonis/Addons/Bouncer';
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext';

import Org from '@/app/modules/org/models/Org';
import User from '@/app/modules/user/models/User';

import MemberInvitationPolicy from '../policies/MemberInvitationPolicy';

export interface InvitationAuthorizationService {
  authorize: (
    action: ExtractActionsForUser<User, MemberInvitationPolicy>
  ) => Promise<void>;
}

export function getInvitationAuthorizationService({
  bouncer,
  org,
}: {
  bouncer: HttpContextContract['bouncer'];
  org: Org;
}): InvitationAuthorizationService {
  async function authorize(
    action: ExtractActionsForUser<User, MemberInvitationPolicy>
  ) {
    return bouncer.with('MemberInvitationPolicy').authorize(action, org);
  }

  return {authorize};
}
