// import {Outlet} from '@remix-run/react';

// import {SubMenuLink} from '@/components/sub-menu-link';

// export {loader} from './_loader.server';

// function AccountNav() {
//   return (
//     <ul className="mb-10 flex space-x-2">
//       <li>
//         <SubMenuLink to={``} end>
//           Profile
//         </SubMenuLink>
//       </li>
//       <li>
//         <SubMenuLink to={`security`}>Security</SubMenuLink>
//       </li>
//       <li>
//         <SubMenuLink to={`invitations`}>Invitations</SubMenuLink>
//       </li>
//     </ul>
//   );
// }

// export default function AccountLayout() {
//   return (
//     <div>
//       <AccountNav />
//       <Outlet />
//     </div>
//   );
// }

import {Outlet} from '@remix-run/react';

import {BaseLayout} from '@/components/base-layout';
import {BaseErrorBoundary} from '@/components/error-boundary';

import {useAccountData} from './use-account-data';

export {loader} from './_loader.server';

import {LockIcon, MailIcon, User2Icon} from 'lucide-react';

const navigationMenu = [
  {
    name: 'Profile',
    href: '/account',
    icon: User2Icon,
    end: true,
  },
  {
    name: 'Security',
    href: '/account/security',
    icon: LockIcon,
    end: false,
  },
  {
    name: 'Invitations',
    href: '/account/invitations',
    icon: MailIcon,
    end: false,
  },
];

export default function OrgLayout() {
  const {currentUser} = useAccountData();

  return (
    <BaseLayout currentUser={currentUser} navigationMenu={navigationMenu}>
      <Outlet />
    </BaseLayout>
  );
}
export const ErrorBoundary = BaseErrorBoundary;
