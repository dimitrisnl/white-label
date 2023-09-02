import {db, pool} from '@/database/db.server';
import type {User} from '@/modules/domain/index.server';
import {MembershipRole, Org, Uuid} from '@/modules/domain/index.server';
import {E} from '@/utils/fp';

import {validate} from './validation.server';

type Response = E.Either<'UnknownError', Org.Org>;

interface Props {
  name: string;
}

export function createOrg() {
  async function execute(
    props: Props,
    userId: User.User['id']
  ): Promise<Response> {
    const orgRecord = await db
      .insert('orgs', {
        id: Uuid.generate(),
        name: props.name,
      })
      .run(pool);

    const toOrg = Org.dbRecordToDomain(orgRecord);

    if (E.isLeft(toOrg)) {
      return E.left('UnknownError');
    }

    const org = toOrg.right;

    await db
      .insert('memberships', {
        org_id: org.id,
        user_id: userId,
        role: MembershipRole.OWNER,
      })
      .run(pool);

    return E.right(org);
  }

  return {
    execute,
    validate,
  };
}
