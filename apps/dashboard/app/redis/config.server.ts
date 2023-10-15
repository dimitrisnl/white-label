import 'dotenv/config';

import * as Schema from '@effect/schema/Schema';

const envValidationSchema = Schema.struct({
  REDIS_HOST: Schema.string.pipe(Schema.minLength(2)),
  REDIS_PASSWORD: Schema.string,
  REDIS_PORT: Schema.NumberFromString,
});

// Throw on-load if missing
export const config = Schema.parseSync(envValidationSchema)(process.env);
