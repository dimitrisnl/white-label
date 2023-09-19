import {NavLink, useParams} from '@remix-run/react';

export function TeamNavLink({
  to,
  end,
  children,
}: {
  to: string;
  end: boolean;
  children: React.ReactNode;
}) {
  const {orgId} = useParams();

  return (
    <NavLink to={`/teams/${orgId}${to}`} end={end}>
      {children}
    </NavLink>
  );
}
