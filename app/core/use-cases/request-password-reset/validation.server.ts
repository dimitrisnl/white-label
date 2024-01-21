import * as Schema from '@effect/schema/Schema';

import * as Email from '~/core/domain/email.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';

const validationSchema = Schema.struct({
  email: Email.emailSchema,
});

export const validate = schemaResolver(validationSchema);

export type RequestPasswordResetProps = Schema.Schema.To<
  typeof validationSchema
>;
