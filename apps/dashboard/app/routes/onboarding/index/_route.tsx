import {GuestLayout} from '@/components/guest-layout';

import {OnboardingSwitch} from './onboarding-switch';

export {loader} from './_loader.server';

export default function OnboardingPage() {
  return (
    <GuestLayout>
      <OnboardingSwitch />
    </GuestLayout>
  );
}
