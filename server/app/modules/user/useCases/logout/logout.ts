import * as E from 'fp-ts/Either';

import {AccessTokenService} from '../../services/accessTokenService';

type Response = E.Either<never, null>;

interface Dependencies {
  accessTokenService: AccessTokenService;
}

export function logout({accessTokenService}: Dependencies) {
  async function execute(): Promise<Response> {
    await accessTokenService.revoke();
    return E.right(null);
  }

  return {
    execute,
  };
}
