import * as E from 'fp-ts/Either';

import User from '../../models/User';
import {PasswordResetService} from '../../services/passwordResetService';
import {validate} from './validation';

type Response = E.Either<'InvalidTokenError', User>;

interface Props {
  token: string;
}

interface Dependencies {
  passwordResetService: PasswordResetService;
}

export function verifyPasswordReset({passwordResetService}: Dependencies) {
  async function execute(props: Props): Promise<Response> {
    const {token} = props;
    const user = await passwordResetService.getUserByToken(token);

    if (!user) {
      return E.left('InvalidTokenError');
    }

    return E.right(user);
  }

  return {
    execute,
    validate,
  };
}
