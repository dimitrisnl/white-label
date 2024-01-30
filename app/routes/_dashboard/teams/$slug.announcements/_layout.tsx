import {
  ClockIcon,
  DocumentCheckIcon,
  DocumentTextIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import {Outlet, useParams} from '@remix-run/react';

import {BaseErrorBoundary} from '~/components/error-boundary.tsx';
import {SubMenu, SubMenuLink} from '~/components/sub-menu';

function Nav() {
  const {slug} = useParams();

  return (
    <SubMenu>
      <SubMenuLink to={`/teams/${slug}/announcements`} end>
        <DocumentTextIcon className="h-5 w-5" /> <div>All announcements</div>
      </SubMenuLink>
      <SubMenuLink to={`/teams/${slug}/announcements`}>
        <DocumentCheckIcon className="h-5 w-5" /> <div>Published</div>
      </SubMenuLink>
      <SubMenuLink to={`/teams/${slug}/announcements`}>
        <PencilSquareIcon className="h-5 w-5" /> <div>Draft</div>
      </SubMenuLink>
      <SubMenuLink to={`/teams/${slug}/announcements`}>
        <ClockIcon className="h-5 w-5" /> <div>Scheduled</div>
      </SubMenuLink>
    </SubMenu>
  );
}

export default function Layout() {
  return (
    <div>
      <Nav />
      <Outlet />
    </div>
  );
}
export const ErrorBoundary = BaseErrorBoundary;
