import {NavLink} from '@remix-run/react';
import React from 'react';

import {cn} from '~/utils/classname-utils';

export function SubMenuLink({
  to,
  children,
  end = false,
}: {
  to: string;
  children: React.ReactNode;
  end?: boolean;
}) {
  return (
    <li>
      <NavLink
        to={to}
        end={end}
        className={({isActive}) =>
          cn(
            'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium',
            {
              'bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-300':
                isActive,
              'text-gray-400 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100':
                !isActive,
            }
          )
        }
      >
        {children}
      </NavLink>
    </li>
  );
}

export function SubMenu({children}: {children: React.ReactNode}) {
  return <ul className="flex space-x-2 px-2 py-2">{children}</ul>;
}
