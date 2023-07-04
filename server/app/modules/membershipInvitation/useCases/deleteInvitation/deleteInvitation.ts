import * as E from 'fp-ts/Either';

import Org from '@/app/modules/org/models/Org';

import {InvitationAuthorizationService} from '../../services/invitationAuthorizationService';
import {validate} from './validation';

interface Dependencies {
  invitationAuthorizationService: InvitationAuthorizationService;
}

type Response = E.Either<'InvitationNotFound' | 'ForbiddenAction', null>;

interface Props {
  invitationId: string;
}

export function deleteInvitation({
  invitationAuthorizationService,
}: Dependencies) {
  async function execute(props: Props, org: Org): Promise<Response> {
    try {
      await invitationAuthorizationService.authorize('delete');
    } catch {
      return E.left('ForbiddenAction');
    }

    const {invitationId} = props;

    const invitation = await org
      .related('membershipInvitations')
      .query()
      .where('id', invitationId)
      .first();

    if (!invitation) {
      return E.left('InvitationNotFound');
    }

    await invitation.delete();

    return E.right(null);
  }

  return {
    execute,
    validate,
  };
}
