import * as Schema from '@effect/schema/Schema';

import {Uuid} from '@/modules/domain/index.server';
import {schemaResolver} from '@/modules/validation-helper';

const validationSchema = Schema.struct({
  token: Uuid.uuidSchema,
});

export const validate = schemaResolver(validationSchema);

export type VerifyEmailProps = Schema.Schema.To<typeof validationSchema>;
