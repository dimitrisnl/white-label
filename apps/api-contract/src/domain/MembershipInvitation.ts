import zod from 'zod'
import * as Uuid from './Uuid'
import * as Email from './Email'
import * as InviteStatus from './InviteStatus'
import * as MembershipRole from './MembershipRole'
import * as Either from 'fp-ts/Either'

export const validationSchema = zod.object({
  id: Uuid.validationSchema,
  orgId: Uuid.validationSchema,
  email: Email.validationSchema,
  status: InviteStatus.validationSchema,
  role: MembershipRole.validationSchema,
  createdAt: zod.date(),
  updatedAt: zod.date(),
}).brand('MembershipInvitation')


export type MembershipInvitation = zod.infer<typeof validationSchema>

export function validate(data: Record<string, any>) {
  return validationSchema.safeParse(data)
}

export function parse(value: unknown): Either.Either<Error, MembershipInvitation> {
  return Either.tryCatch(() => validationSchema.parse(value), Either.toError);
}