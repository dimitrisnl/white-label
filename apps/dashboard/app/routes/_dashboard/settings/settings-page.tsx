import {useTypedLoaderData} from 'remix-typedjson';

import {BaseLayout} from '@/components/layouts/base-layout';

import {ChangeNameForm} from './change-name-form';
import {ChangePasswordForm} from './change-password-form';
import type {SettingsLoaderData} from './loader.server';

export function SettingsPage() {
  const response = useTypedLoaderData<SettingsLoaderData>();

  const {
    data: {currentUser},
  } = response;

  return (
    <BaseLayout title="Settings" currentUser={currentUser}>
      <div className="grid grid-cols-2 gap-8">
        <ChangeNameForm initialName={currentUser.user.name} />
        <ChangePasswordForm />
      </div>
    </BaseLayout>
  );
}
