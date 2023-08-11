import {db, pool} from '@/database/db.server';
import {User} from '@/modules/domain/index.server';
import {E} from '@/utils/fp';

type Response = E.Either<'UnknownError' | 'UserNotFoundError', User.User>;

export function getUser() {
  async function execute(userId: User.User['id']): Promise<Response> {
    const userRecord = await db
      .selectOne('users', {
        id: userId,
      })
      .run(pool);

    if (!userRecord) {
      return E.left('UserNotFoundError');
    }

    const toUser = User.dbRecordToDomain(userRecord);
    if (E.isLeft(toUser)) {
      return E.left('UnknownError');
    }

    const user = toUser.right;

    return E.right(user);
  }

  return {execute};
}
