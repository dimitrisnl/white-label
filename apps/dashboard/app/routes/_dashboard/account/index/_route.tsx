import {useTypedLoaderData} from 'remix-typedjson';

import type {UserDetailsLoaderData} from './_loader.server.ts';
import {ChangeNameForm} from './change-name-form.tsx';

export {action} from './_action.server.ts';
export {loader} from './_loader.server.ts';

export default function IndexPage() {
  const {
    data: {user},
  } = useTypedLoaderData<UserDetailsLoaderData>();
  return <ChangeNameForm initialName={user.name} />;
}
