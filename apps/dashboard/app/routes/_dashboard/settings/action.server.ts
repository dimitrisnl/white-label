import type {Request} from '@remix-run/node';
import {changePasswordRequest, editUserRequest} from 'api-contract';

import {isErrorObject} from '@/lib/isErrorObject';
import {respond} from '@/lib/respond';
import {requireToken} from '@/lib/session';

import {changePassword, editUser} from './requests';

function handleNameChange(formData: FormData, token: string) {
  const validation = editUserRequest.validate(Object.fromEntries(formData));

  if (!validation.success) {
    // todo: fix
    return respond.fail.validation({
      name: 'Invalid name',
    });
  }

  const payload = validation.data;

  return editUser({data: payload, token})
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

export type NameChangeAction = typeof handleNameChange;

function handlePasswordChange(formData: FormData, token: string) {
  const validation = changePasswordRequest.validate(
    Object.fromEntries(formData)
  );

  if (!validation.success) {
    // todo: fix
    return respond.fail.validation({
      password: 'Invalid password',
    });
  }

  const payload = validation.data;

  return changePassword({data: payload, token})
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

export type PasswordChangeAction = typeof handlePasswordChange;

export async function action({request}: {request: Request}) {
  const token = await requireToken(request);

  const formData = await request.formData();
  const formName = formData.get('formName');

  if (formName === 'CHANGE_NAME_FORM') {
    formData.delete('formName');
    return handleNameChange(formData, token);
  } else if (formName === 'CHANGE_PASSWORD_FORM') {
    formData.delete('formName');
    return handlePasswordChange(formData, token);
  }

  return new Response('Invalid form name', {status: 400});
}
