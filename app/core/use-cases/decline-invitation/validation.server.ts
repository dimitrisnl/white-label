import * as Schema from '@effect/schema/Schema';

import * as Uuid from '~/core/domain/uuid.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';

const validationSchema = Schema.struct({
  invitationId: Uuid.uuidSchema,
});

export const validate = schemaResolver(validationSchema);

export type DeclineInvitationProps = Schema.Schema.To<typeof validationSchema>;
