import * as Schema from '@effect/schema/Schema';

import * as Password from '~/core/domain/password.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';

const validationSchema = Schema.struct({
  oldPassword: Password.passwordSchema,
  newPassword: Password.passwordSchema,
});

export const validate = schemaResolver(validationSchema);

export type ChangePasswordProps = Schema.Schema.To<typeof validationSchema>;
