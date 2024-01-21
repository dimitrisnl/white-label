import type {MetaFunction} from '@remix-run/node';
import {isRouteErrorResponse, useRouteError} from '@remix-run/react';

import {ErrorPage} from '~/components/error-page.tsx';
import {PageSkeleton} from '~/components/page-skeleton.tsx';

import {useOrgData} from '../../$slug/use-org-data.ts';
import {TeamInfo} from './team-info.tsx';

export {action} from './_action.server.ts';

export const meta: MetaFunction = () => {
  return [
    {title: 'Team'},
    {name: 'description', content: 'Team settings page'},
  ];
};

export default function TeamPage() {
  const {org} = useOrgData();

  return (
    <PageSkeleton
      header="Team details"
      description="Update your team's details"
    >
      <TeamInfo initialName={org.name} />
    </PageSkeleton>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 500) {
      return <ErrorPage />;
    }

    return (
      // eslint-disable-next-line
      <ErrorPage statusCode={error.status} messages={error.data?.errors} />
    );
  }

  return <ErrorPage />;
}
