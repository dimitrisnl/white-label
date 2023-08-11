import {db, pool} from '@/database/db.server';
import {E} from '@/utils/fp';

import {validate} from './validation.server';

type Response = E.Either<'InvalidTokenError', string>;

interface Props {
  token: string;
}

export function verifyPasswordReset() {
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

    return E.right(verifyEmailTokenRecord.user_id);
  }

  return {
    execute,
    validate,
  };
}
