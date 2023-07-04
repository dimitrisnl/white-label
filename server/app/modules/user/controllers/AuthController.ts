import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext';
import * as E from 'fp-ts/Either';

import {getAccessTokenService} from '../services/accessTokenService';
import {getVerifyEmailService} from '../services/verifyEmailService';
import {login} from '../useCases/login';
import {logout} from '../useCases/logout';
import {register} from '../useCases/register';

export class AuthController {
  async register({request, auth, response}: HttpContextContract) {
    const payload = request.body();

    const accessTokenService = getAccessTokenService({auth});
    const verifyEmailService = getVerifyEmailService();

    const {validate, execute} = register({
      accessTokenService,
      verifyEmailService,
    });

    const props = await validate(payload);
    const result = await execute(props);

    if (E.isLeft(result)) {
      const error = result.left;
      switch (error) {
        case 'AccountAlreadyExistsError':
          return response.badRequest({
            message: 'An account with this email already exists',
          });
      }
    }

    const {token, user} = result.right;
    await auth.login(user);
    response.created({token, user});
  }

  async login({request, response, auth}: HttpContextContract) {
    const payload = request.body();

    const accessTokenService = getAccessTokenService({auth});
    const {validate, execute} = login({accessTokenService});

    const props = await validate(payload);
    const result = await execute(props);

    if (E.isLeft(result)) {
      const error = result.left;
      switch (error) {
        case 'InvalidCredentialsError':
          return response.badRequest({message: 'Your credentials are wrong'});
      }
    }

    const {token} = result.right;
    return response.ok({token});
  }

  async logout({response, auth}: HttpContextContract) {
    const accessTokenService = getAccessTokenService({auth});

    const result = await logout({accessTokenService}).execute();

    if (E.isLeft(result)) {
      return response.badRequest({message: 'Something went wrong'});
    }

    return response.noContent();
  }
}
