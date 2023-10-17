import {useAccountData} from '../use-account-data.ts';
import {ChangeNameForm} from './change-name-form.tsx';

export {action} from './_action.server.ts';

export default function IndexPage() {
  const {currentUser} = useAccountData();
  return <ChangeNameForm initialName={currentUser.user.name} />;
}
