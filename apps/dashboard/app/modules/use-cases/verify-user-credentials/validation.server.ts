import * as Schema from '@effect/schema/Schema';

import {Email, Password} from '@/modules/domain/index.server';
import {schemaResolver} from '@/modules/validation-helper.server';

const validationSchema = Schema.struct({
  email: Email.emailSchema,
  password: Password.passwordSchema,
});

export const validate = schemaResolver(validationSchema);

export type VerifyUserCredentialsProps = Schema.Schema.To<
  typeof validationSchema
>;
