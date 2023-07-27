import type {LoaderArgs, Request} from '@remix-run/node';
import {editUserRequest} from 'api-contract';

import {isErrorObject} from '@/lib/isErrorObject';
import {respond} from '@/lib/respond';
import {requireToken} from '@/lib/session';

import {editOrg} from './requests';

function handleNameChange({
  formData,
  orgId,
  token,
}: {
  formData: FormData;
  orgId: string;
  token: string;
}) {
  const validation = editUserRequest.validate(formData);

  if (!validation.success) {
    // todo: fix
    return respond.fail.validation({
      name: 'Invalid name',
    });
  }

  const payload = validation.data;

  return editOrg({
    token,
    data: payload,
    orgId,
  })
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
    return handleNameChange({
      formData,
      orgId,
      token,
    });
  }

  return new Response('Invalid form name', {status: 400});
}
