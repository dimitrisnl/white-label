import * as Data from 'effect/Data';

export class ForbiddenActionError {
  readonly _tag = 'ForbiddenActionError';
}

export class InviteeExistsError {
  readonly _tag = 'InviteeExistsError';
}

export class InviteeAlreadyMemberError {
  readonly _tag = 'InviteeAlreadyMemberError';
}

export class UnknownError {
  readonly _tag = 'UnknownError';
}

export class DatabaseError {
  readonly _tag = 'DatabaseError';
}

export class InvitationNotFoundError {
  readonly _tag = 'InvitationNotFoundError';
}

export class DbRecordParseError {
  readonly _tag = 'DbRecordParseError';
}

export class AccountAlreadyExistsError {
  readonly _tag = 'AccountAlreadyExistsError';
}

export class PasswordHashError {
  readonly _tag = 'PasswordHashError';
}

export class UserNotFoundError {
  readonly _tag = 'UserNotFoundError';
}

export class OrgNotFoundError {
  readonly _tag = 'OrgNotFoundError';
}

export class PasswordResetTokenNotFoundError {
  readonly _tag = 'PasswordResetTokenNotFoundError';
}

export class IncorrectPasswordError {
  readonly _tag = 'IncorrectPasswordError';
}

export class VerifyEmailTokenNotFoundError {
  readonly _tag = 'VerifyEmailTokenNotFoundError';
}

export class InvalidCredentialsError {
  readonly _tag = 'InvalidCredentialsError';
}

export class InternalServerError {
  readonly _tag = 'InternalServerError';
}

export class SessionNotFoundError {
  readonly _tag = 'SessionNotFoundError';
}

export class SlugAlreadyExistsError {
  readonly _tag = 'SlugAlreadyExistsError';
}

export class ValidationError extends Data.TaggedClass('ValidationError')<{
  readonly errors: Array<string>;
}> {}

export class InvalidIntent {
  readonly _tag = 'InvalidIntent';
}
