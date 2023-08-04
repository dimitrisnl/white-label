import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext';
import * as E from 'fp-ts/Either';

import {getInvitationAuthorizationService} from '../services/invitationAuthorizationService';
import {acceptInvitation} from '../useCases/acceptInvitation';
import {createInvitation} from '../useCases/createInvitation';
import {declineInvitation} from '../useCases/declineInvitation';
import {deleteInvitation} from '../useCases/deleteInvitation';
import {getInvitations} from '../useCases/getInvitations';

export class MembershipInvitationController {
  async index({response, org}: HttpContextContract) {
    const result = await getInvitations().execute(org!);

    if (E.isLeft(result)) {
      return response.badRequest({message: 'Something went wrong'});
    }

    const invitations = result.right;
    return response.ok({membershipInvitations: invitations});
  }

  async create({response, request, org, bouncer}: HttpContextContract) {
    const payload = request.body();

    const invitationAuthorizationService = getInvitationAuthorizationService({
      bouncer,
      org: org!,
    });
    const {validate, execute} = createInvitation({
      invitationAuthorizationService,
    });
    const props = await validate(payload);
    const result = await execute(props, org!);

    if (E.isLeft(result)) {
      const error = result.left;
      switch (error) {
        case 'ForbiddenAction':
          return response.badRequest({
            message: "You don't have access to create an invitation",
          });
        case 'InviteeExists':
          return response.badRequest({message: 'Invitee already exists'});
        default:
          return response.badRequest({message: 'Something went wrong'});
      }
    }

    const invitation = result.right;
    return response.created({invitation});
  }

  async delete({response, request, org, bouncer}: HttpContextContract) {
    const invitationId = request.param('invitationId') as string;

    const invitationAuthorizationService = getInvitationAuthorizationService({
      bouncer,
      org: org!,
    });
    const {validate, execute} = deleteInvitation({
      invitationAuthorizationService,
    });

    const props = await validate({invitationId});
    const result = await execute(props, org!);

    if (E.isLeft(result)) {
      const error = result.left;
      switch (error) {
        case 'InvitationNotFound':
          return response.badRequest({message: 'Invitation not found'});
        case 'ForbiddenAction':
          // Don't leak information about whether the invitation exists
          return response.badRequest({message: 'Invitation not found'});
        default:
          return response.badRequest({message: 'Something went wrong'});
      }
    }

    return response.noContent();
  }

  async decline({response, request}: HttpContextContract) {
    const invitationId = request.param('invitationId') as string;

    const result = await declineInvitation().execute(invitationId);

    if (E.isLeft(result)) {
      const error = result.left;
      switch (error) {
        case 'InvitationNotFound':
          return response.badRequest({message: 'Invitation not found'});
        default:
          return response.badRequest({message: 'Something went wrong'});
      }
    }

    return response.noContent();
  }

  async accept({auth, response, request}: HttpContextContract) {
    const invitationId = request.param('invitationId') as string;
    const user = auth.user!;

    const result = await acceptInvitation().execute(invitationId, user);

    if (E.isLeft(result)) {
      const error = result.left;
      switch (error) {
        case 'InvitationNotFound':
          return response.badRequest({message: 'Invitation not found'});
        default:
          return response.badRequest({message: 'Something went wrong'});
      }
    }

    return response.noContent();
  }
}
