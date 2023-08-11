import {db, pool} from '@/database/db.server';
import {Password} from '@/modules/domain/index.server';
import {E} from '@/utils/fp';

import {validate} from './validation.server';

type Response = E.Either<'InvalidTokenError' | 'UnknownError', void>;

interface Props {
  token: string;
  password: string;
}

export function resetPassword() {
  async function execute(props: Props): Promise<Response> {
    const {token, password} = props;

    const passwordResetTokenRecord = await db
      .selectOne('password_reset_tokens', {
        id: token,
      })
      .run(pool);

    if (!passwordResetTokenRecord) {
      return E.left('InvalidTokenError');
    }

    const userRecord = await db
      .selectOne('users', {
        id: passwordResetTokenRecord.user_id,
      })
      .run(pool);

    if (!userRecord) {
      return E.left('InvalidTokenError');
    }

    let hash;
    try {
      hash = await Password.hash(password);
    } catch {
      return E.left('UnknownError');
    }

    // add transactions
    await db.update('users', {password: hash}, {id: userRecord.id}).run(pool);

    await db
      .deletes('password_reset_tokens', {
        id: token,
      })
      .run(pool);

    return E.right(undefined);
  }

  return {
    execute,
    validate,
  };
}
