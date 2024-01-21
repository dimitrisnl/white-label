import * as Schema from '@effect/schema/Schema';

import {uuidSchema} from '~/core/domain/uuid.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';

const validationSchema = Schema.struct({
  invitationId: uuidSchema,
});

export const validate = schemaResolver(validationSchema);

export type AcceptInvitationProps = Schema.Schema.To<typeof validationSchema>;
