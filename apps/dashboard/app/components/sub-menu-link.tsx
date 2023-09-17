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
        cn('flex h-16 items-center border-b px-3 text-sm font-medium', {
          'text-primary border-primary': isActive,
          'hover:text-primary border-transparent': !isActive,
        })
      }
    >
      {children}
    </NavLink>
  );
}
