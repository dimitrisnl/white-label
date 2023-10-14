import {NavLink} from '@remix-run/react';
import {cn} from '@white-label/ui-core';

import type {Membership} from '@/modules/domain/index.server';

export function MainNav({
  memberships,
  navigationMenu,
}: {
  memberships: Array<Membership.Membership>;
  navigationMenu: Array<{
    name: string;
    href: string;
    icon: React.ElementType;
    end: boolean;
  }>;
}) {
  return (
    <nav className="flex flex-1 flex-col">
      <ul className="flex flex-1 flex-col gap-y-7">
        <li>
          <ul className="-mx-2 space-y-1">
            {navigationMenu.map((item) => (
              <li key={item.name}>
                <NavLink
                  end={item.end}
                  to={item.href}
                  className={({isActive}) =>
                    cn(
                      'group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                      {
                        'active bg-gray-50 text-blue-600': isActive,
                        'text-gray-700 hover:bg-gray-50 hover:text-blue-600':
                          !isActive,
                      }
                    )
                  }
                >
                  <item.icon
                    className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-blue-600 group-[.active]:text-blue-600"
                    aria-hidden="true"
                  />
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </li>
        <li className="mt-auto">
          <div className="text-xs font-semibold leading-6 text-gray-400">
            Your teams
          </div>
          <ul className="-mx-2 mt-2 space-y-1">
            {memberships.map((membership) => (
              <li key={membership.org.id}>
                <NavLink
                  to={`/teams/${membership.org.slug}`}
                  className={({isActive}) =>
                    cn(
                      'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                      {
                        'active bg-gray-50 text-blue-600': isActive,
                        'text-gray-700 hover:bg-gray-50 hover:text-blue-600':
                          !isActive,
                      }
                    )
                  }
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-[0.625rem] font-medium uppercase text-gray-400 group-hover:border-blue-600 group-hover:text-blue-600 group-[.active]:border-blue-600 group-[.active]:text-blue-600">
                    {membership.org.name[0]}
                  </span>
                  <span className="truncate">{membership.org.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </nav>
  );
}
