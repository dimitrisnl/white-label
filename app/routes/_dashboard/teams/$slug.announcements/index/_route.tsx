import type {MetaFunction} from '@remix-run/node';
import {useTypedLoaderData} from 'remix-typedjson';

import {PageSkeleton} from '~/components/page-skeleton';

import type {AnnouncementsLoaderData} from './_loader.server';
import {AnnouncementsTable} from './announcements-table.tsx';
import {CreateNewAnnouncementDialog} from './create-new-announcement-dialog.tsx';

export {action} from './_action.server.ts';
export {loader} from './_loader.server.ts';

export const meta: MetaFunction = () => {
  return [
    {title: 'Announcements'},
    {name: 'description', content: 'Announcements page'},
  ];
};

export default function Page() {
  const {
    data: {announcements},
  } = useTypedLoaderData<AnnouncementsLoaderData>();

  return (
    <PageSkeleton
      header="Announcements"
      description="Handle all your announcements"
      actionsSlot={<CreateNewAnnouncementDialog />}
    >
      {announcements.length > 0 ? (
        <AnnouncementsTable announcements={announcements} />
      ) : (
        <div>This should be an empty-state skeleton</div>
      )}
    </PageSkeleton>
  );
}
