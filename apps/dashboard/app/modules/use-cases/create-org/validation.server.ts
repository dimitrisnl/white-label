import * as Schema from '@effect/schema/Schema';

import {Org} from '@/modules/domain/index.server';
import {schemaResolver} from '@/modules/validation-helper.server';

const validationSchema = Schema.struct({
  name: Org.orgNameSchema,
});

export const validate = schemaResolver(validationSchema);

export type CreateOrgProps = Schema.Schema.To<typeof validationSchema>;
