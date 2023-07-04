import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext';

import MissingOrgException from '../exceptions/MissingOrgException';

export default class LoadOrg {
  async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const orgId = ctx.request.header('x-org-id')!;

    if (!orgId) {
      throw new MissingOrgException();
    }

    const org = await ctx.auth
      .user!.related('orgs')
      .query()
      .where('org_id', orgId)
      .first();

    ctx.org = org;

    await next();
  }
}
