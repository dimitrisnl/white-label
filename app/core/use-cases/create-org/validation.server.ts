import * as Schema from '@effect/schema/Schema';

import * as Org from '~/core/domain/org.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';

const validationSchema = Schema.struct({
  name: Org.orgNameSchema,
});

export const validate = schemaResolver(validationSchema);

export type CreateOrgProps = Schema.Schema.To<typeof validationSchema>;
