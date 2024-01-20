import {
  CogIcon,
  GlobeAltIcon,
  HomeIcon,
  // LifebuoyIcon,
  PowerIcon,
  PresentationChartBarIcon,
} from '@heroicons/react/24/outline';
import UserCircleIcon from '@heroicons/react/24/outline/UserCircleIcon';
import {Link, NavLink, useParams} from '@remix-run/react';
import {cn} from '@white-label/ui-core/utils';

function StyledLink({
  item,
}: {
  item: {
    end: boolean;
    href: string;
    icon: React.ElementType;
    name: string;
  };
}) {
  return (
    <NavLink
      end={item.end}
      to={item.href}
      className={({isActive}) =>
        cn(
          'group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold',
          {
            'active bg-gray-200 text-gray-900': isActive,
            'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow':
              !isActive,
          }
        )
      }
    >
      <item.icon
        className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-gray-600 group-[.active]:text-gray-800"
        aria-hidden="true"
      />
      {item.name}
    </NavLink>
  );
}

export function MainNav() {
  const {slug} = useParams();

  const topMenu = [
    {name: 'Dashboard', href: '', icon: HomeIcon, end: true},
    {
      name: 'Feature A',
      href: `/teams/${slug}/feature-a`,
      icon: GlobeAltIcon,
      end: false,
    },
    {
      name: 'Feature B',
      href: `/teams/${slug}/feature-b`,
      icon: PresentationChartBarIcon,
      end: false,
    },
    {
      name: 'Team Settings',
      href: `/teams/${slug}/settings`,
      icon: CogIcon,
      end: false,
    },
  ];

  const bottomMenu = [
    {
      name: 'Account',
      href: `/teams/${slug}/account`,
      icon: UserCircleIcon,
      end: false,
    },
  ];

  return (
    <nav className="flex flex-1 flex-col">
      <ul className="flex flex-1 flex-col gap-y-7">
        <li>
          <ul className="space-y-1">
            {topMenu.map((item) => (
              <li key={item.name}>
                <StyledLink item={item} />
              </li>
            ))}
          </ul>
        </li>
        <li className="mt-auto">
          <hr className="my-4 border-gray-200" />
          <ul className="mt-2 space-y-1">
            {bottomMenu.map((item) => (
              <li key={item.name}>
                <StyledLink item={item} />
              </li>
            ))}
            {/* <li>
              <Link
                to="/support"
                className="group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold text-gray-600 hover:bg-white hover:text-blue-600 hover:shadow"
              >
                <LifebuoyIcon
                  className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-blue-600"
                  aria-hidden="true"
                />
                Support
              </Link>
            </li> */}
            <li>
              <Link
                to="/logout"
                className="group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold text-gray-600 hover:bg-white hover:text-red-600 hover:shadow"
              >
                <PowerIcon
                  className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-red-600"
                  aria-hidden="true"
                />
                Logout
              </Link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
}
