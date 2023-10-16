import * as Schema from '@effect/schema/Schema';

import {Password} from '@/modules/domain/index.server';
import {schemaResolver} from '@/modules/validation-helper.server';

const validationSchema = Schema.struct({
  oldPassword: Password.passwordSchema,
  newPassword: Password.passwordSchema,
});

export const validate = schemaResolver(validationSchema);

export type ChangePasswordProps = Schema.Schema.To<typeof validationSchema>;
