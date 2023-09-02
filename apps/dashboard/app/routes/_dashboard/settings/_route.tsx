import type {V2_MetaFunction} from '@remix-run/node';

import {ErrorPage} from '@/components/error-page';

export {SettingsPage as default} from './settings-page';

export {action} from './action.server';
export {loader} from './loader.server';

export const meta: V2_MetaFunction = () => {
  return [{title: 'Settings'}, {name: 'description', content: 'Settings page'}];
};

export function ErrorBoundary() {
  return <ErrorPage />;
}
