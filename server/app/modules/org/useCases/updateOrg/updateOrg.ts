import * as E from 'fp-ts/Either';

import Org from '../../models/Org';
import {OrgAuthorizationService} from '../../services/orgAuthorizationService';
import {validate} from './validation';

type Response = E.Either<'ForbiddenAction', Org>;

interface Props {
  name: string;
}

interface Dependencies {
  orgAuthorizationService: OrgAuthorizationService;
}

export function updateOrg({orgAuthorizationService}: Dependencies) {
  async function execute(props: Props, org: Org): Promise<Response> {
    try {
      await orgAuthorizationService.authorize('update');
    } catch {
      return E.left('ForbiddenAction');
    }

    await org.merge(props).save();
    return E.right(org);
  }
  return {
    execute,
    validate,
  };
}
