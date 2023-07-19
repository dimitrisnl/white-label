import type {Request} from '@remix-run/node';
import {json} from '@remix-run/node';

import {createUserSession} from '@/lib/session';

import {register} from './requests';

export async function action({request}: {request: Request}) {
  const formData = await request.formData();
  return register(formData)
    .then(({data}) => {
      return createUserSession({
        request,
        token: data.token.token,
      });
    })
    .catch((error) => {
      return json({ok: false, messageObject: error.response.data});
    });
}
