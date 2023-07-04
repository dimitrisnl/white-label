import Event from '@ioc:Adonis/Core/Event';

import Org from '@/app/modules/org/models/Org';

import MembershipInvitation from '../models/MembershipInvitation';

export async function sendInvitationEmailEvent(
  membershipInvitation: MembershipInvitation,
  org: Org
) {
  return Event.emit('send-invitation-email', {
    membershipInvitation,
    org,
  });
}
