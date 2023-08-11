import type {LoaderArgs, Request} from '@remix-run/node';

import type {User} from '@/modules/domain/index.server';
import {Org} from '@/modules/domain/index.server';
import {requireUserId} from '@/modules/session.server';
import {createInvitation, editOrg} from '@/modules/use-cases/index.server';
import {E, pipe} from '@/utils/fp';
import {respond} from '@/utils/respond.server';

async function handleNameChange({
  formData,
  orgId,
  userId,
}: {
  formData: FormData;
  orgId: Org.Org['id'];
  userId: User.User['id'];
}) {
  const {validate, execute} = editOrg();
  const validation = validate(Object.fromEntries(formData));

  if (!validation.success) {
    // todo: fix
    return respond.fail.validation({
      name: 'Invalid name',
    });
  }

  const payload = validation.data;

  const response = await execute(payload, orgId, userId);

  return pipe(
    response,
    E.matchW(
      () => respond.fail.unknown(),
      () => respond.ok.empty()
    )
  );
}

export type NameChangeAction = typeof handleNameChange;

async function handleMembershipInvitation({
  formData,
  orgId,
  userId,
}: {
  formData: FormData;
  orgId: Org.Org['id'];
  userId: User.User['id'];
}) {
  const {validate, execute} = createInvitation();
  const validation = validate(Object.fromEntries(formData));

  if (!validation.success) {
    // todo: fix
    return respond.fail.validation({
      email: 'Invalid email',
    });
  }

  const payload = validation.data;

  const response = await execute(payload, orgId, userId);

  return pipe(
    response,
    E.matchW(
      () => respond.fail.unknown(),
      () => respond.ok.empty()
    )
  );
}

export type CreateMembershipInvitationAction =
  typeof handleMembershipInvitation;

export async function action({
  request,
  params,
}: {
  request: Request;
  params: LoaderArgs['params'];
}) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const formName = formData.get('formName');

  const parsedOrgId = Org.parseId(params.orgId);

  if (E.isLeft(parsedOrgId)) {
    return new Response('Invalid params', {status: 400});
  }

  const orgId = parsedOrgId.right;

  if (formName === 'EDIT_ORG_FORM') {
    formData.delete('formName');
    return handleNameChange({
      formData,
      orgId,
      userId,
    });
  } else if (formName === 'CREATE_MEMBERSHIP_INVITATION_FORM') {
    formData.delete('formName');
    return handleMembershipInvitation({
      formData,
      orgId,
      userId,
    });
  }

  return new Response('Invalid form name', {status: 400});
}
