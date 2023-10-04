import * as Schema from '@effect/schema/Schema';

import {User} from '@/modules/domain/index.server';
import {schemaResolver} from '@/modules/validation-helper';

const validationSchema = Schema.struct({
  name: User.userNameSchema,
});

export const validate = schemaResolver(validationSchema);

export type EditUserProps = Schema.Schema.To<typeof validationSchema>;
