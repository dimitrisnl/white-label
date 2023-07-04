import {MessageContract} from '@ioc:Adonis/Addons/Mail';

import {AppMailer} from '@/app/mailer/AppMailer';

import User from '../models/User';

export class PasswordResetMailer extends AppMailer {
  constructor(protected user: User, protected token: string) {
    super();
  }
  prepare(message: MessageContract) {
    message
      .from(this.from)
      .replyTo(this.replyTo, 'Support team')
      .to(this.user.email)
      .subject('Password Reset')
      .htmlView('emails/password-reset', {
        user: this.user,
        url: `${this.baseUrl}?token=${this.token}`,
      });
  }
}
