import {db, pool} from '@/database/db.server';
import {User} from '@/modules/domain/index.server';
import {E} from '@/utils/fp';

import {validate} from './validation.server';

type Response = E.Either<'UserNotFoundError' | 'UnknownError', null>;

interface Props {
  email: string;
}

export function requestPasswordReset() {
  async function execute(props: Props): Promise<Response> {
    const {email} = props;

    const userRecord = await db
      .selectOne('users', {
        email,
      })
      .run(pool);

    if (!userRecord) {
      return E.left('UserNotFoundError');
    }

    const toUser = User.dbRecordToDomain(userRecord);

    if (E.isLeft(toUser)) {
      return E.left('UnknownError');
    }

    // Send password reset email
    // const token = await passwordResetService.generateToken(user);
    // await sendPasswordResetEmailEvent(user, token);

    return E.right(null);
  }

  return {
    execute,
    validate,
  };
}
