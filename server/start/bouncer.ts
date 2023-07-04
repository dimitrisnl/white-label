import Bouncer from '@ioc:Adonis/Addons/Bouncer';

export const {actions} = Bouncer;

export const {policies} = Bouncer.registerPolicies({
  OrgPolicy: () => import('@/app/modules/org/policies/OrgPolicy'),
  MemberInvitationPolicy: () =>
    import(
      '@/app/modules/membershipInvitation/policies/MemberInvitationPolicy'
    ),
});
