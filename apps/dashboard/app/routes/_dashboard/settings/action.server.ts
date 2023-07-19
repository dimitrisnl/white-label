import type {Request} from '@remix-run/node';
import {json} from '@remix-run/node';

import {requireToken} from '@/lib/session';

import {changePassword, editUser} from './requests';

export async function action({request}: {request: Request}) {
  const token = await requireToken(request);

  const formData = await request.formData();
  const formName = formData.get('formName');

  if (formName === 'CHANGE_NAME_FORM') {
    formData.delete('formName');
    return editUser({data: formData, token})
      .then(({data}) => {
        return json({ok: true, data});
      })
      .catch((error) => {
        const message = error.response.data;
        return json({ok: false, messageObject: message});
      });
  } else if (formName === 'CHANGE_PASSWORD_FORM') {
    formData.delete('formName');
    return changePassword({data: formData, token})
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
