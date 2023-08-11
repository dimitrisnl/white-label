import {db, pool} from '@/database/db.server';
import {Membership, User} from '@/modules/domain/index.server';
import {E} from '@/utils/fp';

type Response = E.Either<
  'UnknownError' | 'UserNotFoundError',
  {
    user: User.User;
    memberships: Array<Membership.Membership>;
  }
>;

export function whoAmI() {
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

    const membershipRecords = await db
      .select('memberships', {
        user_id: userId,
      })
      .run(pool);

    const memberships = [];
    for (const membershipRecord of membershipRecords) {
      const toMembership = Membership.dbRecordToDomain(membershipRecord, {
        name: 'Temp Org Name',
        id: membershipRecord.org_id,
        // todo
        created_at: new Date().toDateString(),
        updated_at: new Date().toDateString(),
      });
      if (E.isLeft(toMembership)) {
        return E.left('UnknownError');
      }
      memberships.push(toMembership.right);
    }

    return E.right({user, memberships});
  }

  return {execute};
}
