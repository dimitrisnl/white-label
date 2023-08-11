import {db, pool} from '@/database/db.server';
import {
  MembershipRole,
  Password,
  User,
  Uuid,
} from '@/modules/domain/index.server';
import {E} from '@/utils/fp';

import {validate} from './validation.server';

type Response = E.Either<
  'AccountAlreadyExistsError' | 'UnknownError',
  {user: User.User}
>;

interface Props {
  email: string;
  password: string;
  name: string;
}

export function createUser() {
  async function execute(props: Props): Promise<Response> {
    let user: User.User;

    let hash;
    try {
      hash = await Password.hash(props.password);
    } catch {
      return E.left('UnknownError');
    }

    try {
      const userRecord = await db
        .insert('users', {
          id: Uuid.generate(),
          email: props.email,
          email_verified: false,
          password: hash,
          name: props.email,
        })
        .run(pool);
      const toUser = User.dbRecordToDomain(userRecord);

      if (E.isLeft(toUser)) {
        return E.left('UnknownError');
      }
      user = toUser.right;
    } catch (error) {
      return E.left('AccountAlreadyExistsError' as const);
    }

    // Create a default team
    const defaultOrg = await db
      .insert('orgs', {
        id: Uuid.generate(),
        name: 'My Team',
      })
      .run(pool);

    // Bind user to the org
    await db
      .insert('memberships', {
        org_id: defaultOrg.id,
        user_id: user.id,
        role: MembershipRole.OWNER,
      })
      .run(pool);

    // todo: Create Verification email
    return E.right({user});
  }

  return {
    execute,
    validate,
  };
}
