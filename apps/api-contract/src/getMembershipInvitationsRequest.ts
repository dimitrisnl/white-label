import * as MembershipInvitation from './domain/MembershipInvitation';

export interface RequestData {
}

export interface ResponseData {
  membershipInvitations: Array<MembershipInvitation.MembershipInvitation>;
}


