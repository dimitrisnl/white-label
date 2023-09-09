import {Link, NavLink} from '@remix-run/react';
import {
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@white-label/ui-core';
import Avatar from 'boring-avatars';
import {Building2Icon, LogOutIcon, SettingsIcon} from 'lucide-react';

import type {User} from '@/modules/domain/index.server';

export function UserNav({user}: {user: User.User}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
          <Avatar
            size={32}
            name={user.name}
            variant="pixel"
            colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-muted-foreground text-xs leading-none">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <NavLink
              to="/settings"
              className={({isActive}) =>
                cn('flex w-full items-center transition-colors', {
                  'text-primary': isActive,
                })
              }
            >
              <SettingsIcon className=" mr-2 h-4 w-4" />
              <span>Settings</span>
            </NavLink>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <NavLink
              to="/teams"
              className={({isActive}) =>
                cn('flex w-full items-center transition-colors', {
                  'text-primary': isActive,
                })
              }
            >
              <Building2Icon className=" mr-2 h-4 w-4" />
              <span>Teams</span>
            </NavLink>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link to="/logout" className="flex w-full items-center">
            <LogOutIcon className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
