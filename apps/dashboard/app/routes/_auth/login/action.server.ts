import type {Request} from '@remix-run/node';
import {loginRequest} from 'api-contract';

import {isErrorObject} from '@/lib/isErrorObject';
import {respond} from '@/lib/respond';
import {createUserSession} from '@/lib/session';

import {login} from './requests';

export async function action({request}: {request: Request}) {
  const formData = await request.formData();
  const validation = loginRequest.validate(formData);

  // todo: fix
  if (!validation.success) {
    return respond.fail.validation({
      email: 'Invalid credentials',
    });
  }

  const payload = validation.data;

  return login(payload)
    .then(({data}) => {
      //redirects away
      return createUserSession({
        request,
        token: data.token.token,
      });
    })
    .catch((error: unknown) => {
      if (isErrorObject(error)) {
        return respond.fail.validation(error.response.data);
      } else {
        return respond.fail.unknown();
      }
    });
}

export type LoginRequestAction = typeof action;
