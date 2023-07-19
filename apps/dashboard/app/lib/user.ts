import {useMatches} from '@remix-run/react';
import {useMemo} from 'react';

type User = {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  orgs: Array<{
    id: string;
    name: string;
    slug: string;
    membership: {
      role: string;
    };
  }>;
};

export function useMatchesData(
  id: string
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
}

function isUser(user: any): user is User {
  return user && typeof user === 'object' && typeof user.email === 'string';
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData('root');

  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User {
  const user = useOptionalUser();
  if (!user) {
    throw new Error('No user');
  }
  return user;
}
