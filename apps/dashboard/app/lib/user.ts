import {useMatches} from '@remix-run/react';
import type {Org, User} from 'api-contract';
import {useMemo} from 'react';
import zod from 'zod';

const userSchema = zod.object({
  id: zod.string(),
  email: zod.string(),
  name: zod.string(),
  emailVerified: zod.boolean(),
  orgs: zod.array(
    zod.object({
      id: zod.string(),
      name: zod.string(),
      slug: zod.string(),
      membership: zod.object({
        role: zod.string(),
      }),
    })
  ),
});

type OrgWithUserRole = Org & {
  membership: {
    role: string;
  };
};

export type UserWithOrgs = User & {
  orgs: Array<OrgWithUserRole>;
};

export function useMatchesData(id: string) {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data as Record<string, unknown> | undefined;
}

function isUser(user: unknown): user is UserWithOrgs {
  const {success} = userSchema.safeParse(user);
  return success;
}

export function useOptionalUser(): UserWithOrgs | undefined {
  const data = useMatchesData('root');

  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): UserWithOrgs {
  const user = useOptionalUser();
  if (!user) {
    throw new Error('No user');
  }
  return user;
}
