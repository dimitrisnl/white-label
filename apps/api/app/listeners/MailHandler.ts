import type {EventsList} from '@ioc:Adonis/Core/Event';

import {MembershipInvitationMailer} from '@/app/modules/membershipInvitation/mailers/MembershipInvitationMail';
import {EmailVerificationMailer} from '@/app/modules/user/mailers/EmailVerificationMailer';
import {PasswordResetMailer} from '@/app/modules/user/mailers/PasswordResetMailer';

export default class MailHandler {
  async onSendVerificationEmail({
    user,
    token,
  }: EventsList['send-verification-email']) {
    await new EmailVerificationMailer(user, token).sendLater();
  }

  async onSendPasswordResetEmail({
    user,
    token,
  }: EventsList['send-password-reset-email']) {
    await new PasswordResetMailer(user, token).sendLater();
  }

  async onSendInvitationEmail({
    membershipInvitation,
    org,
  }: EventsList['send-invitation-email']) {
    await new MembershipInvitationMailer(membershipInvitation, org).sendLater();
  }
}
