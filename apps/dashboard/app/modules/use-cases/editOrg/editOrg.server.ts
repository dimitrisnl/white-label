import {db, pool} from '@/database/db.server';
import type {User} from '@/modules/domain/index.server';
import {Org} from '@/modules/domain/index.server';
import {orgAuthorizationService} from '@/modules/services/index.server';
import {E} from '@/utils/fp';

import {validate} from './validation.server';

type Response = E.Either<'ForbiddenAction' | 'UnknownError', Org.Org>;

interface Props {
  name: string;
}

export function editOrg() {
  async function execute(
    props: Props,
    orgId: Org.Org['id'],
    userId: User.User['id']
  ): Promise<Response> {
    try {
      const hasAccess = await orgAuthorizationService.canUpdate(userId, orgId);
      if (!hasAccess) {
        return E.left('ForbiddenAction');
      }
    } catch {
      return E.left('ForbiddenAction');
    }

    const [orgRecord] = await db
      .update('orgs', {name: props.name}, {id: orgId})
      .run(pool);

    const toOrg = Org.dbRecordToDomain(orgRecord);

    if (E.isLeft(toOrg)) {
      return E.left('UnknownError');
    }

    const org = toOrg.right;

    return E.right(org);
  }
  return {
    execute,
    validate,
  };
}
