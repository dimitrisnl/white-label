import type {Request, LoaderArgs} from '@remix-run/node';
import {json} from '@remix-run/node';

import {requireToken} from '@/lib/session';

import {editOrg} from './requests';

export async function action({
  request,
  params,
}: {
  request: Request;
  params: LoaderArgs['params'];
}) {
  const token = await requireToken(request);
  const orgId = params.orgId!;

  const formData = await request.formData();
  const formName = formData.get('formName');

  if (formName === 'EDIT_ORG_FORM') {
    formData.delete('formName');
    return editOrg({
      token,
      data: formData,
      orgId,
    })
      .then(({data}) => {
        return json({ok: true, data});
      })
      .catch((error) => {
        const message = error.response.data;
        return json({ok: false, messageObject: message});
      });
  }

  return new Response('Invalid form name', {status: 400});
}
