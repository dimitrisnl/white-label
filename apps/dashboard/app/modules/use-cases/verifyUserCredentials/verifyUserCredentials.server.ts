import {db, pool} from '@/database/db.server';
import {Password, User} from '@/modules/domain/index.server';
import {E} from '@/utils/fp';

import {validate} from './validation.server';

type Response = E.Either<'InvalidCredentialsError' | 'UnknownError', User.User>;

interface Props {
  email: string;
  password: string;
}

export function verifyUserCredentials() {
  async function execute(props: Props): Promise<Response> {
    const {email, password} = props;

    const userRecord = await db
      .selectOne('users', {
        email,
      })
      .run(pool);

    if (!userRecord) {
      return E.left('InvalidCredentialsError');
    }

    try {
      const isPasswordValid = await Password.compare({
        plainText: password,
        hashValue: userRecord.password,
      });
      if (!isPasswordValid) {
        return E.left('InvalidCredentialsError');
      }
    } catch {
      return E.left('UnknownError');
    }

    const toUser = User.dbRecordToDomain(userRecord);

    if (E.isLeft(toUser)) {
      return E.left('UnknownError');
    }

    const user = toUser.right;

    return E.right(user);
  }

  return {
    execute,
    validate,
  };
}
