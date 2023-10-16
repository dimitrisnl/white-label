import * as Schema from '@effect/schema/Schema';

import {Uuid} from '@/modules/domain/index.server';
import {schemaResolver} from '@/modules/validation-helper.server';

const validationSchema = Schema.struct({
  invitationId: Uuid.uuidSchema,
});

export const validate = schemaResolver(validationSchema);

export type DeclineInvitationProps = Schema.Schema.To<typeof validationSchema>;
