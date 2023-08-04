import zod from 'zod';
import * as User from './domain/User';
import * as MembershipInvitation from './domain/MembershipInvitation';
import * as Email from './domain/Email';
import * as MembershipRole from './domain/MembershipRole';

export interface RequestData {
  email: string;
  role: string;
}

export interface ResponseData {
  invitation: MembershipInvitation.MembershipInvitation;
}

export const validationSchema = zod.object({
  email: Email.validationSchema,
  role: MembershipRole.validationSchema,
});

export function validate(data: Record<string, any>) {
  return validationSchema.safeParse(data);
}
