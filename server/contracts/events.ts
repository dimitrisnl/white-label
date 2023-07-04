import MembershipInvitation from '@/app/modules/membershipInvitation/models/MembershipInvitation';
import Org from '@/app/modules/org/models/Org';
import User from '@/app/modules/user/models/User';

declare module '@ioc:Adonis/Core/Event' {
  interface EventsList {
    'send-verification-email': {
      user: User;
      token: string;
    };
    'send-password-reset-email': {
      user: User;
      token: string;
    };
    'send-invitation-email': {
      membershipInvitation: MembershipInvitation;
      org: Org;
    };
  }
}
