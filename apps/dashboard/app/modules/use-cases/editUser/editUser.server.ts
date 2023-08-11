import {db, pool} from '@/database/db.server';
import {User} from '@/modules/domain/index.server';
import {E} from '@/utils/fp';

import {validate} from './validation.server';

interface Props {
  name: string;
}

type Response = E.Either<'UnknownError', User.User>;

export function editUser() {
  async function execute(
    props: Props,
    userId: User.User['id']
  ): Promise<Response> {
    const {name} = props;

    const [userRecord] = await db
      .update('users', {name}, {id: userId})
      .run(pool);

    const toUser = User.dbRecordToDomain(userRecord);

    if (E.isLeft(toUser)) {
      return E.left('UnknownError');
    }

    return toUser;
  }

  return {
    execute,
    validate,
  };
}
