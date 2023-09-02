import {db, pool} from '@/database/db.server';
import {E} from '@/utils/fp';

import {validate} from './validation.server';

type Response = E.Either<'InvalidTokenError', null>;

interface Props {
  token: string;
}

export function verifyEmailToken() {
  async function execute(props: Props): Promise<Response> {
    const {token} = props;

    const verifyEmailTokenRecord = await db
      .selectOne('verify_email_tokens', {
        id: token,
      })
      .run(pool);

    if (!verifyEmailTokenRecord) {
      return E.left('InvalidTokenError');
    }

    const userRecord = await db
      .selectOne('users', {
        id: verifyEmailTokenRecord.user_id,
      })
      .run(pool);

    if (!userRecord) {
      return E.left('InvalidTokenError');
    }

    // add transactions
    await db
      .update('users', {email_verified: true}, {id: userRecord.id})
      .run(pool);

    await db
      .deletes('verify_email_tokens', {
        id: token,
      })
      .run(pool);

    return E.right(null);
  }

  return {
    execute,
    validate,
  };
}
