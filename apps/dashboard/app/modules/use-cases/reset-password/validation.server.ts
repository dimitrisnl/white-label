import * as Schema from '@effect/schema/Schema';

import {Password, Uuid} from '@/modules/domain/index.server';
import {schemaResolver} from '@/modules/validation-helper';

const validationSchema = Schema.struct({
  password: Password.passwordSchema,
  token: Uuid.uuidSchema,
});

export const validate = schemaResolver(validationSchema);

export type ResetPasswordProps = Schema.Schema.To<typeof validationSchema>;
