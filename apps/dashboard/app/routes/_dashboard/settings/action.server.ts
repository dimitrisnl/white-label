import type {Request} from '@remix-run/node';
import {pipe} from 'fp-ts/lib/function';

import type {User} from '@/modules/domain/index.server';
import {requireUserId} from '@/modules/session.server';
import {changePassword, editUser} from '@/modules/use-cases/index.server';
import {E} from '@/utils/fp';
import {respond} from '@/utils/respond.server';

async function handleNameChange(formData: FormData, userId: User.User['id']) {
  const {validate, execute} = editUser();

  const validation = validate(Object.fromEntries(formData));

  if (!validation.success) {
    // todo: fix
    return respond.fail.validation({
      name: 'Invalid name',
    });
  }

  const payload = validation.data;
  const response = await execute(payload, userId);

  return pipe(
    response,
    E.matchW(
      () => respond.fail.unknown(),
      () => respond.ok.empty()
    )
  );
}

export type NameChangeAction = typeof handleNameChange;

async function handlePasswordChange(
  formData: FormData,
  userId: User.User['id']
) {
  const {validate, execute} = changePassword();

  const validation = validate(Object.fromEntries(formData));

  if (!validation.success) {
    // todo: fix
    return respond.fail.validation({
      password: 'Invalid password',
    });
  }

  const payload = validation.data;
  const response = await execute(payload, userId);

  return pipe(
    response,
    E.matchW(
      () => respond.fail.unknown(),
      () => respond.ok.empty()
    )
  );
}

export type PasswordChangeAction = typeof handlePasswordChange;

export async function action({request}: {request: Request}) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const formName = formData.get('formName');

  if (formName === 'CHANGE_NAME_FORM') {
    formData.delete('formName');
    return handleNameChange(formData, userId);
  } else if (formName === 'CHANGE_PASSWORD_FORM') {
    formData.delete('formName');
    return handlePasswordChange(formData, userId);
  }

  return new Response('Invalid form name', {status: 400});
}
