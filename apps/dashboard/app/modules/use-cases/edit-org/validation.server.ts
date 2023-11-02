import * as Schema from '@effect/schema/Schema';

import {Org} from '~/modules/domain/index.server.ts';
import {schemaResolver} from '~/modules/validation-helper.server.ts';

const validationSchema = Schema.struct({
  name: Org.orgNameSchema,
});

export const validate = schemaResolver(validationSchema);

export type EditOrgProps = Schema.Schema.To<typeof validationSchema>;
