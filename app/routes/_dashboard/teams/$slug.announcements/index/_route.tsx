import {PlusIcon} from '@heroicons/react/24/outline';
import type {MetaFunction} from '@remix-run/node';
import {Link, useNavigate, useParams} from '@remix-run/react';
import {useTypedLoaderData} from 'remix-typedjson';

import {EmptyState} from '~/components/empty-state.tsx';
import {PageSkeleton} from '~/components/page-skeleton';
import {buttonVariants} from '~/components/ui/button.tsx';

import type {AnnouncementsLoaderData} from './_loader.server';
import {AnnouncementsTable} from './announcements-table.tsx';

export {action} from './_action.server.ts';
export {loader} from './_loader.server.ts';

export const meta: MetaFunction = () => {
  return [
    {title: 'Announcements'},
    {name: 'description', content: 'Announcements page'},
  ];
};

export default function Page() {
  const navigate = useNavigate();
  const params = useParams();
  const slug = params.slug!;
  const {
    data: {announcements},
  } = useTypedLoaderData<AnnouncementsLoaderData>();

  return (
    <PageSkeleton
      header="Announcements"
      description="Handle all your announcements"
      actionsSlot={
        <Link to="new" className={buttonVariants({variant: 'outline'})}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Create new announcement
        </Link>
      }
    >
      {announcements.length > 0 ? (
        <AnnouncementsTable announcements={announcements} />
      ) : (
        <div className="pt-8">
          <EmptyState
            title="No announcements"
            description="Get started by creating a new announcement"
            cta="New Announcement"
            onClick={() => {
              navigate(`/teams/${slug}/announcements/new`);
            }}
          />
        </div>
      )}
    </PageSkeleton>
  );
}
