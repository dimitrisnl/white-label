import * as Schema from '@effect/schema/Schema';

import {Password} from '~/modules/domain/index.server.ts';
import {schemaResolver} from '~/modules/validation-helper.server.ts';

const validationSchema = Schema.struct({
  oldPassword: Password.passwordSchema,
  newPassword: Password.passwordSchema,
});

export const validate = schemaResolver(validationSchema);

export type ChangePasswordProps = Schema.Schema.To<typeof validationSchema>;
