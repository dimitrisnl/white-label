import {useTypedLoaderData} from 'remix-typedjson';

import {BaseLayout} from '@/components/layouts/base-layout';

import {ChangeNameForm} from './change-name-form';
import {ChangePasswordForm} from './change-password-form';
import type {SettingsLoaderData} from './loader.server';

export function SettingsPage() {
  const {
    data: {currentUser},
  } = useTypedLoaderData<SettingsLoaderData>();

  return (
    <BaseLayout title="Settings" user={currentUser.user}>
      <div className="mx-auto grid max-w-lg grid-cols-1 gap-8">
        <ChangeNameForm initialName={currentUser.user.name} />
        <ChangePasswordForm />
      </div>
    </BaseLayout>
  );
}
