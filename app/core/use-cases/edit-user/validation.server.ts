import * as Schema from '@effect/schema/Schema';

import * as User from '~/core/domain/user.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';

const validationSchema = Schema.struct({
  name: User.userNameSchema,
});

export const validate = schemaResolver(validationSchema);

export type EditUserProps = Schema.Schema.To<typeof validationSchema>;
