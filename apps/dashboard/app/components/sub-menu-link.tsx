import {NavLink} from '@remix-run/react';
import {cn} from '@white-label/ui-core';

export function SubMenuLink({
  to,
  children,
  end = false,
}: {
  to: string;
  children: string;
  end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({isActive}) =>
        cn('rounded-md px-3 py-2 text-sm font-medium', {
          'bg-gray-100 text-gray-700': isActive,
          'text-gray-500 hover:text-gray-700': !isActive,
        })
      }
    >
      {children}
    </NavLink>
  );
}
