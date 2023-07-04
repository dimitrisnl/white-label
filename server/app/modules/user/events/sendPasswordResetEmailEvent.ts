import Event from '@ioc:Adonis/Core/Event';

import User from '@/app/modules/user/models/User';

export async function sendPasswordResetEmailEvent(user: User, token: string) {
  return Event.emit('send-password-reset-email', {
    user,
    token,
  });
}
