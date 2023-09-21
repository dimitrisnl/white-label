import {GuestLayout} from '@/components/guest-layout';

import {TeamInfo} from './team-info';

export {action} from './_action.server';

export default function OnboardingPage() {
  return (
    <GuestLayout>
      <TeamInfo />
    </GuestLayout>
  );
}
