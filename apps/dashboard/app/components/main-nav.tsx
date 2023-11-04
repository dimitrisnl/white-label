import {BuildingOffice2Icon, PlusCircleIcon} from '@heroicons/react/24/outline';
import {NavLink} from '@remix-run/react';
import {cn} from '@white-label/ui-core/utils';

import type {Org} from '~/modules/domain/index.server';

export function MainNav({
  navigationMenu,
  currentOrg,
}: {
  navigationMenu: Array<{
    name: string;
    href: string;
    icon: React.ElementType;
    end: boolean;
  }>;
  currentOrg?: Org.Org;
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
          <ul className="-mx-2 mt-2 space-y-1">
            <hr className="my-4 border-gray-200" />
            {currentOrg ? (
              <li>
                <div className="group flex select-none gap-x-3 rounded-md bg-gray-50 p-2 text-sm font-semibold leading-6 text-blue-600">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border  border-blue-600 bg-white text-[0.625rem] font-medium  uppercase text-blue-600 group-hover:border-blue-600 group-hover:text-blue-600">
                    {currentOrg.name[0]}
                  </span>
                  <span className="truncate">{currentOrg.name}</span>
                </div>
              </li>
            ) : null}
            <li>
              <NavLink
                to={`/teams`}
                className="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              >
                <BuildingOffice2Icon className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-blue-600" />
                <span className="truncate">All Teams</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/teams/create-new-team`}
                className="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              >
                <PlusCircleIcon className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-blue-600" />
                <span className="truncate">Create new Team</span>
              </NavLink>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
}
