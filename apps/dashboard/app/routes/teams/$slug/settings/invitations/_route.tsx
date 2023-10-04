import type {MetaFunction} from '@remix-run/node';
import {useTypedLoaderData} from 'remix-typedjson';

import {InvitationsLoaderData} from './_loader.server';
import {CreateInvitationForm} from './create-invitation-form';
import {InvitationsList} from './invitations-list';

export {action} from './_action.server';
export {loader} from './_loader.server';

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
