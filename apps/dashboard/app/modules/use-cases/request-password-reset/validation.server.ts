import * as Schema from '@effect/schema/Schema';

import {Email} from '@/modules/domain/index.server';
import {schemaResolver} from '@/modules/validation-helper.server';

const validationSchema = Schema.struct({
  email: Email.emailSchema,
});

export const validate = schemaResolver(validationSchema);

export type RequestPasswordResetProps = Schema.Schema.To<
  typeof validationSchema
>;
