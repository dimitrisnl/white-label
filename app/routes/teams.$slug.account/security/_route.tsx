import {PageSkeleton} from '~/components/page-skeleton.tsx';

import {ChangePasswordForm} from './change-password-form.tsx';

export {action} from './_action.server.ts';
export {loader} from './_loader.server.ts';

export default function SecurityPage() {
  return (
    <PageSkeleton header="Password" description="Update your password">
      <ChangePasswordForm />
    </PageSkeleton>
  );
}
