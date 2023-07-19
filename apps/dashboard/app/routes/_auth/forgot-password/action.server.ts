import type {Request} from '@remix-run/node';
import {json} from '@remix-run/node';

import {forgotPassword} from './requests';

export async function action({request}: {request: Request}) {
  const formData = await request.formData();

  return forgotPassword(formData)
    .then(({data}) => {
      return json({ok: true});
    })
    .catch((error) => {
      return json({ok: false, messageObject: error.response.data});
    });
}
