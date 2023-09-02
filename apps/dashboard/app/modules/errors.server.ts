export class ForbiddenActionError {
  readonly _tag = 'ForbiddenActionError';
}

export class InviteeExistsError {
  readonly _tag = 'InviteeExistsError';
}

export class UnknownError {
  readonly _tag = 'UnknownError';
}

export class DatabaseError {
  readonly _tag = 'DatabaseError';
}

export class ValidationError {
  readonly _tag = 'ValidationError';
}

// todo: embed the validation errors
// export class ValidationError extends Data.TaggedClass('ValidationError')<{
//   readonly messages: Array<string>;
// }> {}

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

export class UUIDGenerationError {
  readonly _tag = 'UUIDGenerationError';
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
