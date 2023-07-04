import {MessageContract} from '@ioc:Adonis/Addons/Mail';

import {AppMailer} from '@/app/mailer/AppMailer';
import Org from '@/app/modules/org/models/Org';

import MembershipInvitation from '../models/MembershipInvitation';

export class MembershipInvitationMailer extends AppMailer {
  constructor(
    protected membershipInvitation: MembershipInvitation,
    protected org: Org
  ) {
    super();
  }
  prepare(message: MessageContract) {
    const orgName = this.org.name;

    message
      .subject('You have been invited to join ' + orgName)
      .from(this.from)
      .to(this.membershipInvitation.email)
      .replyTo(this.replyTo, 'Support team')
      .htmlView('emails/membership-invitation', {
        orgName,
        url: `${this.baseUrl}/register`,
        declineUrl: `${this.baseUrl}/membership-invitation/decline?token=${this.membershipInvitation.id}`,
      });
  }
}
