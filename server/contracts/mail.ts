import {InferMailersFromConfig} from '@adonisjs/mail/build/config';

import mailConfig from '../config/mail';

declare module '@ioc:Adonis/Addons/Mail' {
  interface MailersList extends InferMailersFromConfig<typeof mailConfig> {}
}
