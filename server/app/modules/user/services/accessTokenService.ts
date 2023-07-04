import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext';

import {AccessToken, toAccessToken} from '../models/AccessToken';
import User from '../models/User';

interface Credentials {
  email: string;
  password: string;
}

export interface AccessTokenService {
  generate(user: User): Promise<AccessToken>;
  revoke(): Promise<void>;
  attempt(credentials: Credentials): Promise<AccessToken>;
}

interface Dependencies {
  auth: HttpContextContract['auth'];
}

export function getAccessTokenService({
  auth,
}: Dependencies): AccessTokenService {
  async function generate(user: User): Promise<AccessToken> {
    const token = await auth.use('api').generate(user, {
      expiresIn: '7 days',
    });

    return toAccessToken(token.toJSON());
  }

  async function revoke(): Promise<void> {
    await auth.use('api').revoke();
  }

  async function attempt({email, password}: Credentials): Promise<AccessToken> {
    const token = await auth.use('api').attempt(email, password, {
      expiresIn: '7 days',
    });

    return toAccessToken(token.toJSON());
  }

  return {
    generate,
    revoke,
    attempt,
  };
}
