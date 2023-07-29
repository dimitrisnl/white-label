import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext';
import * as E from 'fp-ts/Either';

import {getOrgAuthorizationService} from '../services/orgAuthorizationService';
import {createOrg} from '../useCases/createOrg';
import {getOrg} from '../useCases/getOrg';
import {updateOrg} from '../useCases/updateOrg';

export class OrgController {
  async get({org, response}: HttpContextContract) {
    const result = await getOrg().execute(org!);

    return response.ok(result);
  }

  async create({auth, response, request}: HttpContextContract) {
    const user = auth.user!;
    const body = request.body();

    const {execute, validate} = createOrg();

    const props = await validate(body);
    const result = await execute(props, user);

    if (E.isLeft(result)) {
      return response.badRequest({message: 'Something went wrong'});
    }

    const org = result.right;
    return response.ok({org});
  }

  async update({response, request, org, bouncer}: HttpContextContract) {
    const body = request.body();

    const orgAuthorizationService = getOrgAuthorizationService({
      bouncer,
      org: org!,
    });

    const {validate, execute} = updateOrg({orgAuthorizationService});
    const props = await validate(body);
    const result = await execute(props, org!);

    if (E.isLeft(result)) {
      const error = result.left;
      switch (error) {
        case 'ForbiddenAction':
          return response.forbidden({
            message: 'You do not have access to edit this org',
          });
      }
    }

    const updatedOrg = result.right;
    return response.ok({org: updatedOrg});
  }
}
