import {useAccountData} from '../use-account-data';
import {ChangeNameForm} from './change-name-form';

export {action} from './_action.server';

export default function IndexPage() {
  const {currentUser} = useAccountData();
  return <ChangeNameForm initialName={currentUser.user.name} />;
}
