import {BaseMailer} from '@ioc:Adonis/Addons/Mail';
import Env from '@ioc:Adonis/Core/Env';

const FE_URL = Env.get('FE_URL');

export class AppMailer extends BaseMailer {
  replyTo = 'support@example.com';
  from = 'team@example.com';
  baseUrl = FE_URL;
}
