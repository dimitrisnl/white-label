import type {Request} from '@remix-run/node';
import {redirect} from 'remix-typedjson';

import {resetPassword} from '@/modules/use-cases/index.server';
import {E, pipe} from '@/utils/fp';
import {respond} from '@/utils/respond.server';

export async function action({request}: {request: Request}) {
  const formData = await request.formData();
  formData.delete('confirmPassword');

  const {validate, execute} = resetPassword();
  const validation = validate(Object.fromEntries(formData));

  // todo: fix
  if (!validation.success) {
    return respond.fail.validation({
      password: 'Invalid credentials',
    });
  }

  const data = validation.data;
  const response = await execute(data);

  if (E.isLeft(response)) {
    return respond.fail.unknown();
  }

  return pipe(
    response,
    E.match(
      () => respond.fail.unknown(),
      () => redirect('/login?resetPassword=true')
    )
  );
}

export type ResetPasswordAction = typeof action;
