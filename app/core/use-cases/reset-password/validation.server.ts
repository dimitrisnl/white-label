import * as Schema from '@effect/schema/Schema';

import * as Password from '~/core/domain/password.server.ts';
import * as Uuid from '~/core/domain/uuid.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server.ts';

const validationSchema = Schema.struct({
  password: Password.passwordSchema,
  token: Uuid.uuidSchema,
});

export const validate = schemaResolver(validationSchema);

export type ResetPasswordProps = Schema.Schema.To<typeof validationSchema>;
