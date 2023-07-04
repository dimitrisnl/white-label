// import Mail from '@ioc:Adonis/Addons/Mail';
import Application from '@ioc:Adonis/Core/Application';
import Event from '@ioc:Adonis/Core/Event';
import Database from '@ioc:Adonis/Lucid/Database';

Event.on('send-verification-email', 'MailHandler.onSendVerificationEmail');
Event.on('send-password-reset-email', 'MailHandler.onSendPasswordResetEmail');
Event.on('send-invitation-email', 'MailHandler.onSendInvitationEmail');

Event.on('db:query', (query) => {
  if (Application.inDev) {
    Database.prettyPrint(query);
  }
});

Event.on('mail:sent', () => {
  if (Application.inDev) {
    // Mail.prettyPrint(data);
  }
});
