import dotenvFlow from 'dotenv-flow';
dotenvFlow.config();

import * as Schema from '@effect/schema/Schema';
import Pg from 'pg';
import * as db from 'zapatos/db';

const envValidationSchema = Schema.struct({
  DB_USER: Schema.string.pipe(Schema.minLength(2)),
  DB_HOST: Schema.string.pipe(Schema.minLength(2)),
  TEST_DB_NAME: Schema.string.pipe(Schema.minLength(2)),
  DB_PASSWORD: Schema.string.pipe(Schema.minLength(2)),
  TEST_DB_PORT: Schema.NumberFromString,
});

// Throw on-load if missing
export const config = Schema.decodeUnknownSync(envValidationSchema)(
  process.env
);

function makeTestPool() {
  return new Pg.Pool({
    user: config.DB_USER,
    host: config.DB_HOST,
    database: config.TEST_DB_NAME,
    password: config.DB_PASSWORD,
    port: config.TEST_DB_PORT,
  });
}

const testDbPool = makeTestPool();

export {db, testDbPool};
