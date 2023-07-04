import * as E from 'fp-ts/Either';

import {Role} from '@/app/constants/Role';
import User from '@/app/modules/user/models/User';

import Org from '../../models/Org';
import {validate} from './validation';

type Response = E.Either<never, Org>;

interface Props {
  name: string;
}

export function createOrg() {
  async function execute(props: Props, user: User): Promise<Response> {
    const org = await Org.create(props);
    await user.related('orgs').attach({[org.id]: {role: Role.OWNER}});

    return E.right(org);
  }

  return {
    execute,
    validate,
  };
}
