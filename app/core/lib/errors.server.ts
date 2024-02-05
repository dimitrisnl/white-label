import * as Data from 'effect/Data';

export class ForbiddenActionError extends Data.TaggedClass(
  'ForbiddenActionError'
)<{
  readonly userId: string;
  readonly action: string;
  readonly resource: string;
  readonly resourceId: string;
  readonly resourceBelongsToOrgId: string;
  readonly reason?: string;
}> {
  constructor(props: {
    userId: string;
    action: string;
    resource: string;
    resourceId: string;
    resourceBelongsToOrgId: string;
    reason?: string;
  }) {
    super(props);
    console.log('[ForbiddenAction]', props);
  }
}

// Already exists
export class InviteeAlreadyMemberError extends Data.TaggedClass(
  'InviteeAlreadyMemberError'
)<{
  readonly inviterId: string;
  readonly orgId: string;
  readonly inviteeEmail: string;
  readonly inviteeId: string;
}> {}

export class AccountAlreadyExistsError extends Data.TaggedClass(
  'AccountAlreadyExistsError'
)<{
  readonly email: string;
}> {}

export class SlugAlreadyExistsError extends Data.TaggedClass(
  'SlugAlreadyExistsError'
)<{
  readonly slug: string;
  readonly orgId: string;
  readonly orgName: string;
}> {}

export class UserEmailAlreadyVerifiedError extends Data.TaggedClass(
  'UserEmailAlreadyVerifiedError'
)<{
  readonly userId: string;
}> {}

// Not found
export class InvitationNotFoundError extends Data.TaggedClass(
  'InvitationNotFoundError'
) {}

export class UserNotFoundError extends Data.TaggedClass('UserNotFoundError') {}

export class OrgNotFoundError extends Data.TaggedClass('OrgNotFoundError') {}

export class PasswordResetTokenNotFoundError extends Data.TaggedClass(
  'PasswordResetTokenNotFoundError'
) {}

export class IncorrectPasswordError extends Data.TaggedClass(
  'IncorrectPasswordError'
) {}

export class VerifyEmailTokenNotFoundError extends Data.TaggedClass(
  'VerifyEmailTokenNotFoundError'
) {}

export class SessionNotFoundError extends Data.TaggedClass(
  'SessionNotFoundError'
) {}

export class AnnouncementNotFoundError extends Data.TaggedClass(
  'AnnouncementNotFoundError'
) {}

// Bad request
export class InvalidCredentialsError extends Data.TaggedClass(
  'InvalidCredentialsError'
)<{
  readonly email: string;
  readonly reason: string;
}> {
  constructor(props: {email: string; reason: string}) {
    super(props);
    console.log('[InvalidCredentials]', props);
  }
}

export class ValidationError extends Data.TaggedClass('ValidationError')<{
  readonly errors: Array<string>;
}> {}

// Internal
export class DatabaseError extends Data.TaggedClass('DatabaseError') {}

export class InternalServerError extends Data.TaggedClass(
  'InternalServerError'
)<{
  readonly reason?: string;
  readonly metadata?: unknown;
}> {
  constructor(props: {reason?: string; metadata?: unknown}) {
    super(props);
    console.log('[InternalServerError]', props);
  }
}
