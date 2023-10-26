import {ChangePasswordForm} from './change-password-form.tsx';

export {action} from './_action.server.ts';
export {loader} from './_loader.server.ts';

export default function SecurityPage() {
  return <ChangePasswordForm />;
}
