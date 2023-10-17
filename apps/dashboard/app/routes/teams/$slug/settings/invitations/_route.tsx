import type {MetaFunction} from '@remix-run/node';
import {useTypedLoaderData} from 'remix-typedjson';

import {InvitationsLoaderData} from './_loader.server.ts';
import {CreateInvitationForm} from './create-invitation-form.tsx';
import {InvitationsList} from './invitations-list.tsx';

export {action} from './_action.server.ts';
export {loader} from './_loader.server.ts';

export const meta: MetaFunction = () => {
  return [
    {title: 'Team Invitations'},
    {name: 'description', content: 'Team invitations page'},
  ];
};

export default function InvitationsPage() {
  const {
    data: {invitations},
  } = useTypedLoaderData<InvitationsLoaderData>();

  return (
    <div className="grid gap-8">
      <CreateInvitationForm />
      <InvitationsList invitations={invitations} />
    </div>
  );
}
