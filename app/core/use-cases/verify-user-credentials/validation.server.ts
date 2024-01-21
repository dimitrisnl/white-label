import * as Schema from '@effect/schema/Schema';

import * as Email from '~/core/domain/email.server.ts';
import * as Password from '~/core/domain/password.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';

const validationSchema = Schema.struct({
  email: Email.emailSchema,
  password: Password.passwordSchema,
});

export const validate = schemaResolver(validationSchema);

export type VerifyUserCredentialsProps = Schema.Schema.To<
  typeof validationSchema
>;
