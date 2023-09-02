import {db, pool} from '@/database/db.server';
import type {User} from '@/modules/domain/index.server';
import {Password} from '@/modules/domain/index.server';
import {E} from '@/utils/fp';

import {validate} from './validation.server';

type Response = E.Either<'IncorrectPasswordError' | 'UnknownError', void>;

interface Props {
  newPassword: string;
  oldPassword: string;
}

export function changePassword() {
  async function execute(
    props: Props,
    userId: User.User['id']
  ): Promise<Response> {
    const {newPassword, oldPassword} = props;

    const userRecord = await db.selectOne('users', {id: userId}).run(pool);

    if (!userRecord) {
      return E.left('UnknownError');
    }

    try {
      const isPasswordValid = await Password.compare({
        plainText: oldPassword,
        hashValue: userRecord.password,
      });
      if (!isPasswordValid) {
        return E.left('IncorrectPasswordError');
      }
    } catch {
      return E.left('UnknownError');
    }

    let hash;
    try {
      hash = await Password.hash(newPassword);
    } catch {
      return E.left('UnknownError');
    }

    await db.update('users', {password: hash}, {id: userId}).run(pool);

    return E.right(undefined);
  }

  return {
    execute,
    validate,
  };
}
