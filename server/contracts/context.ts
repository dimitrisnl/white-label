import Org from '@/app/modules/org/models/Org';

declare module '@ioc:Adonis/Core/HttpContext' {
  interface HttpContextContract {
    org: Org | null;
  }
}
