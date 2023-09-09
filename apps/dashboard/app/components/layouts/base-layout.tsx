import {NavLink} from '@remix-run/react';
import {cn} from '@white-label/ui-core';
import React from 'react';

import {UserNav} from '@/components/user-nav';
import type {Membership, User} from '@/modules/domain/index.server';

// import TeamSwitcher from '../team-switcher';

function MainNav({className, ...props}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      <NavLink
        to="/"
        className={({isActive}) =>
          cn('hover:text-primary text-sm font-medium transition-colors', {
            'text-primary': isActive,
          })
        }
      >
        Overview
      </NavLink>
      <NavLink
        to="/teams"
        className={({isActive}) =>
          cn('hover:text-primary text-sm font-medium transition-colors', {
            'text-primary': isActive,
          })
        }
      >
        Teams
      </NavLink>
      <NavLink
        to="/settings"
        className={({isActive}) =>
          cn('hover:text-primary text-sm font-medium transition-colors', {
            'text-primary': isActive,
          })
        }
      >
        Settings
      </NavLink>
    </nav>
  );
}

export function BaseLayout({
  children,
  title,
  titleSlot,
  currentUser,
}: {
  children: React.ReactNode;
  title: string;
  titleSlot?: React.ReactNode;
  currentUser: {user: User.User; memberships: Array<Membership.Membership>};
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b shadow-2xl">
        <div className="flex h-16 items-center border-b px-4">
          <h1 className="mr-4 text-2xl font-bold tracking-tight">
            White Label
          </h1>
          {/* <TeamSwitcher memberships={currentUser.memberships} /> */}
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav user={currentUser.user} />
          </div>
        </div>
        <div className="flex h-16 items-center px-8">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            {titleSlot}
          </div>
        </div>
      </div>
      <div className="h-full flex-1 space-y-4 bg-gray-50 p-8 pt-6">
        {children}
      </div>
    </div>
  );
}
