import {useTypedLoaderData} from 'remix-typedjson';

import {PageSkeleton} from '~/components/page-skeleton.tsx';

import type {UserDetailsLoaderData} from './_loader.server.ts';
import {ChangeDetailsForm} from './change-details-form.tsx';

export {action} from './_action.server.ts';
export {loader} from './_loader.server.ts';

export default function IndexPage() {
  const {
    data: {user},
  } = useTypedLoaderData<UserDetailsLoaderData>();
  return (
    <PageSkeleton
      header="Personal details"
      description="Update your user's details"
    >
      <ChangeDetailsForm initialName={user.name} initialEmail={user.email} />
    </PageSkeleton>
  );
}
