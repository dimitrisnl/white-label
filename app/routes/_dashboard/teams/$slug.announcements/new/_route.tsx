import type {MetaFunction} from '@remix-run/node';

import {PageSkeleton} from '~/components/page-skeleton';

export const meta: MetaFunction = () => {
  return [
    {title: 'New Announcement'},
    {name: 'description', content: 'Announcements page'},
  ];
};

export default function Page() {
  return (
    <PageSkeleton
      header="New Announcement"
      description="Add a new announcement"
    >
      Lorem ipsum
    </PageSkeleton>
  );
}
