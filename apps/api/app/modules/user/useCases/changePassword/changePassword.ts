import Hash from '@ioc:Adonis/Core/Hash';
import * as E from 'fp-ts/Either';

import User from '../../models/User';
import {validate} from './validation';

type Response = E.Either<'IncorrectPasswordError', User>;

interface Props {
  newPassword: string;
  oldPassword: string;
}

export function changePassword() {
  async function execute(props: Props, user: User): Promise<Response> {
    const {newPassword, oldPassword} = props;
    const isPasswordValid = await Hash.verify(user.password, oldPassword);

    if (!isPasswordValid) {
      return E.left('IncorrectPasswordError');
    }

    await user.merge({password: newPassword}).save();

    return E.right(user);
  }

  return {
    execute,
    validate,
  };
}
