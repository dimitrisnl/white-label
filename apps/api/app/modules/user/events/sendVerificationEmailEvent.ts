import Event from '@ioc:Adonis/Core/Event';

import User from '@/app/modules/user/models/User';

export async function sendVerificationEmailEvent(user: User, token: string) {
  return Event.emit('send-verification-email', {
    user,
    token,
  });
}
