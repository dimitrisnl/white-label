import * as Schema from '@effect/schema/Schema';

import * as Email from '~/core/domain/email.server';
import * as Password from '~/core/domain/password.server';
import * as User from '~/core/domain/user.server';
import {schemaResolver} from '~/core/lib/validation-helper.server';

const validationSchema = Schema.struct({
  password: Password.passwordSchema,
  email: Email.emailSchema,
  name: User.userNameSchema,
});

export const validate = schemaResolver(validationSchema);

export type CreateUserProps = Schema.Schema.To<typeof validationSchema>;
