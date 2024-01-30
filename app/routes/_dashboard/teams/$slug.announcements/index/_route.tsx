import type {MetaFunction} from '@remix-run/node';
import {useTypedLoaderData} from 'remix-typedjson';

import {PageSkeleton} from '~/components/page-skeleton';

import type {AnnouncementsLoaderData} from './_loader.server';

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
    >
      Lorem ipsum
      {announcements.map((announcement) => (
        <div key={announcement.id}>{announcement.title}</div>
      ))}
    </PageSkeleton>
  );
}
