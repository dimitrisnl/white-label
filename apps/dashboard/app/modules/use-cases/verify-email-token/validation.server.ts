import * as Schema from '@effect/schema/Schema';

import {Uuid} from '@/modules/domain/index.server.ts';
import {schemaResolver} from '@/modules/validation-helper.server.ts';

const validationSchema = Schema.struct({
  token: Uuid.uuidSchema,
});

export const validate = schemaResolver(validationSchema);

export type VerifyEmailProps = Schema.Schema.To<typeof validationSchema>;
