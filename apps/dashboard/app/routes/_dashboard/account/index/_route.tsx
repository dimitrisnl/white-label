import {useCurrentUserData} from '../../use-current-user.ts';
import {ChangeNameForm} from './change-name-form.tsx';

export {action} from './_action.server.ts';

export default function IndexPage() {
  const {currentUser} = useCurrentUserData();
  return <ChangeNameForm initialName={currentUser.user.name} />;
}
