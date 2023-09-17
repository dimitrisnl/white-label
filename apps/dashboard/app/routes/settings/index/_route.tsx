import {useSettingsData} from '../use-settings-data';
import {ChangeNameForm} from './change-name-form';

export {action} from './_action.server';

export default function IndexPage() {
  const {currentUser} = useSettingsData();
  return <ChangeNameForm initialName={currentUser.user.name} />;
}
