import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext';

export default class SilentAuthMiddleware {
  async handle({auth}: HttpContextContract, next: () => Promise<void>) {
    await auth.check();
    await next();
  }
}
