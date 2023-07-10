import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext';

export default class EmailVerified {
  async handle(
    {auth, response}: HttpContextContract,
    next: () => Promise<void>
  ) {
    if (auth.user && !auth.user.emailVerified) {
      return response.forbidden({message: 'Email not verified'});
    }

    await next();
  }
}
