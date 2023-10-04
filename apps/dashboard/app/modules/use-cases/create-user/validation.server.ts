import * as Schema from '@effect/schema/Schema';

import {Email, Password, User} from '@/modules/domain/index.server';
import {schemaResolver} from '@/modules/validation-helper';

const validationSchema = Schema.struct({
  password: Password.passwordSchema,
  email: Email.emailSchema,
  name: User.userNameSchema,
});

export const validate = schemaResolver(validationSchema);

export type CreateUserProps = Schema.Schema.To<typeof validationSchema>;
