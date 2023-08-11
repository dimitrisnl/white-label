import {db, pool} from '@/database/db.server';
import type {User} from '@/modules/domain/index.server';
import {Org} from '@/modules/domain/index.server';
import {E} from '@/utils/fp';

type Response = E.Either<
  'OrgNotFoundError' | 'UnknownError',
  {org: Org.Org; users: Array<User.User>}
>;

export function getOrg() {
  async function execute(orgId: Org.Org['id']): Promise<Response> {
    // todo: can user see this?
    const orgRecord = await db
      .selectOne('orgs', {
        id: orgId,
      })
      .run(pool);

    if (!orgRecord) {
      return E.left('OrgNotFoundError');
    }

    const toOrg = Org.dbRecordToDomain(orgRecord);

    if (E.isLeft(toOrg)) {
      return E.left('UnknownError');
    }

    const org = toOrg.right;

    return E.right({
      org,
      users: [] as Array<User.User>,
    });
  }

  return {
    execute,
  };
}
