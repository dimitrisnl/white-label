import * as E from 'fp-ts/Either';

import User from '../../models/User';
import {PasswordResetService} from '../../services/passwordResetService';
import {validate} from './validation';

type Response = E.Either<'InvalidTokenError', User>;

interface Props {
  token: string;
  password: string;
}

interface Dependencies {
  passwordResetService: PasswordResetService;
}

export function resetPassword({passwordResetService}: Dependencies) {
  async function execute(props: Props): Promise<Response> {
    const {token, password} = props;
    const user = await passwordResetService.getUserByToken(token);

    if (!user) {
      return E.left('InvalidTokenError');
    }

    await passwordResetService.deleteToken(user);
    await user.merge({password}).save();

    return E.right(user);
  }

  return {
    execute,
    validate,
  };
}
