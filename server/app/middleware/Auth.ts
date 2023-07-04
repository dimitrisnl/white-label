import {AuthenticationException} from '@adonisjs/auth/build/standalone';
import type {GuardsList} from '@ioc:Adonis/Addons/Auth';
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext';

export default class AuthMiddleware {
  protected async authenticate(
    auth: HttpContextContract['auth'],
    guards: Array<keyof GuardsList>
  ) {
    let guardLastAttempted: string | undefined;

    for (const guard of guards) {
      guardLastAttempted = guard;

      if (await auth.use(guard).check()) {
        auth.defaultGuard = guard;
        return true;
      }
    }

    // Unable to authenticate using any guard
    throw new AuthenticationException(
      'Unauthorized access',
      'E_UNAUTHORIZED_ACCESS',
      guardLastAttempted
    );
  }

  async handle(
    {auth}: HttpContextContract,
    next: () => Promise<void>,
    customGuards: Array<keyof GuardsList>
  ) {
    const guards = customGuards.length ? customGuards : [auth.name];
    await this.authenticate(auth, guards);
    await next();
  }
}
