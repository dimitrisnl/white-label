import {ChangePasswordForm} from './change-password-form';

export {action} from './_action.server';
export {loader} from './_loader.server';

export default function SecurityPage() {
  return <ChangePasswordForm />;
}
