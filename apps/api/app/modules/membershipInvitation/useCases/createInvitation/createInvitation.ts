import * as E from 'fp-ts/Either';

import {UNIQUE_CONSTRAINT_VIOLATION} from '@/app/constants/dbCodes';
import {Role} from '@/app/constants/Role';
import Org from '@/app/modules/org/models/Org';

import {sendInvitationEmailEvent} from '../../events/sendInvitationEmailEvent';
import MembershipInvitation from '../../models/MembershipInvitation';
import {InvitationAuthorizationService} from '../../services/invitationAuthorizationService';
import {validate} from './validation';

interface Dependencies {
  invitationAuthorizationService: InvitationAuthorizationService;
}

interface Props {
  email: string;
  role: Role;
}

type Response = E.Either<
  'ForbiddenAction' | 'InviteeExists' | 'UnknownError',
  MembershipInvitation
>;

export function createInvitation({
  invitationAuthorizationService,
}: Dependencies) {
  async function execute(props: Props, org: Org): Promise<Response> {
    try {
      await invitationAuthorizationService.authorize('create');
    } catch {
      return E.left('ForbiddenAction');
    }

    try {
      const invitation = await org
        .related('membershipInvitations')
        .create(props);

      await sendInvitationEmailEvent(invitation, org);

      return E.right(invitation);
    } catch (error) {
      // Unique constraint violation
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === UNIQUE_CONSTRAINT_VIOLATION) {
        return E.left('InviteeExists');
      }
      return E.left('UnknownError');
    }
  }

  return {
    execute,
    validate,
  };
}
