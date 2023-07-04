import * as E from 'fp-ts/Either';

import {AccessToken} from '../../models/AccessToken';
import {AccessTokenService} from '../../services/accessTokenService';
import {validate} from './validation';

type Response = E.Either<'InvalidCredentialsError', {token: AccessToken}>;

interface Props {
  email: string;
  password: string;
}

interface Dependencies {
  accessTokenService: AccessTokenService;
}

export function login({accessTokenService}: Dependencies) {
  async function execute(props: Props): Promise<Response> {
    let token: AccessToken;

    try {
      token = await accessTokenService.attempt(props);
    } catch {
      return E.left('InvalidCredentialsError' as const);
    }

    return E.right({token});
  }

  return {
    execute,
    validate,
  };
}
