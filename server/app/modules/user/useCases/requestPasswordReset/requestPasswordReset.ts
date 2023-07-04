import * as E from 'fp-ts/Either';

import {sendPasswordResetEmailEvent} from '../../events/sendPasswordResetEmailEvent';
import User from '../../models/User';
import {PasswordResetService} from '../../services/passwordResetService';
import {validate} from './validation';

type Response = E.Either<'UserNotFoundError', null>;

interface Props {
  email: string;
}

interface Dependencies {
  passwordResetService: PasswordResetService;
}

export function requestPasswordReset({passwordResetService}: Dependencies) {
  async function execute(props: Props): Promise<Response> {
    const {email} = props;

    const user = await User.query().where('email', email).first();

    if (!user) {
      return E.left('UserNotFoundError');
    }

    // Send password reset email
    const token = await passwordResetService.generateToken(user);
    await sendPasswordResetEmailEvent(user, token);

    return E.right(null);
  }

  return {
    execute,
    validate,
  };
}
