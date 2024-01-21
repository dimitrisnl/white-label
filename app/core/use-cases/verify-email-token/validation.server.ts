import * as Schema from '@effect/schema/Schema';

import * as Uuid from '~/core/domain/uuid.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server.ts';

const validationSchema = Schema.struct({
  token: Uuid.uuidSchema,
});

export const validate = schemaResolver(validationSchema);

export type VerifyEmailProps = Schema.Schema.To<typeof validationSchema>;
