import type {V2_MetaFunction} from '@remix-run/node';

import {BaseLayout} from '@/components/layouts/base-layout';
import {useUser} from '@/lib/user';

import {ChangeNameForm} from './change-name-form';
import {ChangePasswordForm} from './change-password-form';

export {action} from './action.server';
export {loader} from './loader.server';

export function SettingsPage() {
  const user = useUser();

  return (
    <BaseLayout title="Settings">
      <div className="mx-auto grid max-w-lg grid-cols-1 gap-8">
        <ChangeNameForm initialName={user.name} />
        <ChangePasswordForm />
      </div>
    </BaseLayout>
  );
}

export const meta: V2_MetaFunction = () => {
  return [{title: 'Settings'}, {name: 'description', content: 'Settings page'}];
};
