import type {Request} from '@remix-run/node';
import {json} from '@remix-run/node';

import {resetPassword} from './requests';

export async function action({request}: {request: Request}) {
  const formData = await request.formData();
  formData.delete('confirmPassword');

  return resetPassword(formData)
    .then(({data}) => {
      return json({ok: true});
    })
    .catch((error) => {
      return json({ok: false, messageObject: error.response.data});
    });
}
