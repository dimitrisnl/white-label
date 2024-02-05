import type {MetaFunction} from '@remix-run/node';

import {BaseErrorBoundary} from '~/components/error-boundary.tsx';
import {PageSkeleton} from '~/components/page-skeleton.tsx';

import {useMetadata} from '../../teams.$slug/use-metadata-data.ts';
import {TeamInfo} from './team-info.tsx';

export {action} from './_action.server.ts';

export const meta: MetaFunction = () => {
  return [
    {title: 'Team'},
    {name: 'description', content: 'Team settings page'},
  ];
};

export default function TeamPage() {
  const {org} = useMetadata();

  return (
    <PageSkeleton
      header="Team details"
      description="Update your team's details"
    >
      <TeamInfo initialName={org.name} />
    </PageSkeleton>
  );
}

export const ErrorBoundary = BaseErrorBoundary;
