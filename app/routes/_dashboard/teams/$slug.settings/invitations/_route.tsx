import type {MetaFunction} from '@remix-run/node';
import {useTypedLoaderData} from 'remix-typedjson';

import {PageSkeleton} from '~/components/page-skeleton.tsx';

import type {InvitationsLoaderData} from './_loader.server.ts';
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
    <PageSkeleton
      header="Team invitations"
      description="Organize your team's invitations"
    >
      <div className="grid gap-12">
        <CreateInvitationForm />
        <InvitationsList invitations={invitations} />
      </div>
    </PageSkeleton>
  );
}
