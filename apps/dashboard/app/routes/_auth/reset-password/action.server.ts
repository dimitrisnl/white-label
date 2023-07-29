import type {Request} from '@remix-run/node';
import {resetPasswordRequest} from 'api-contract';

import {isErrorObject} from '@/lib/isErrorObject';
import {respond} from '@/lib/respond';

import {resetPassword} from './requests';

export async function action({request}: {request: Request}) {
  const formData = await request.formData();
  formData.delete('confirmPassword');

  const validation = resetPasswordRequest.validate(
    Object.fromEntries(formData)
  );

  // todo: fix
  if (!validation.success) {
    return respond.fail.validation({
      password: 'Invalid credentials',
    });
  }

  const payload = validation.data;

  return resetPassword(payload)
    .then(() => {
      return respond.ok.empty();
    })
    .catch((error: unknown) => {
      if (isErrorObject(error)) {
        return respond.fail.validation(error.response.data);
      } else {
        return respond.fail.unknown();
      }
    });
}

export type ResetPasswordAction = typeof action;
