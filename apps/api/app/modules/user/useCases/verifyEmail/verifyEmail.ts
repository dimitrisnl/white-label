import * as E from 'fp-ts/Either';

import {VerifyEmailService} from '../../services/verifyEmailService';
import {validate} from './validation';

type Response = E.Either<'InvalidTokenError', null>;

interface Props {
  token: string;
}

interface Dependencies {
  verifyEmailService: VerifyEmailService;
}

export function verifyEmail({verifyEmailService}: Dependencies) {
  async function execute(props: Props): Promise<Response> {
    const {token} = props;
    const user = await verifyEmailService.getUserByToken(token);

    if (!user) {
      return E.left('InvalidTokenError');
    }

    await verifyEmailService.deleteToken(user);
    await user.merge({emailVerified: true}).save();

    return E.right(null);
  }

  return {
    execute,
    validate,
  };
}
