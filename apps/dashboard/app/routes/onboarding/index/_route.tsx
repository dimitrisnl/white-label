import {GuestLayout} from '@/components/guest-layout.tsx';

import {OnboardingSwitch} from './onboarding-switch.tsx';

export {loader} from './_loader.server.ts';

export default function OnboardingPage() {
  return (
    <GuestLayout>
      <OnboardingSwitch />
    </GuestLayout>
  );
}
