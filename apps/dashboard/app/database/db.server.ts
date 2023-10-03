import 'dotenv/config';

import * as Schema from '@effect/schema/Schema';
import {Pool} from 'pg';
import * as db from 'zapatos/db';

const envValidationSchema = Schema.struct({
  DB_USER: Schema.string.pipe(Schema.minLength(2)),
  DB_HOST: Schema.string.pipe(Schema.minLength(2)),
  DB_NAME: Schema.string.pipe(Schema.minLength(2)),
  DB_PASSWORD: Schema.string.pipe(Schema.minLength(2)),
  DB_PORT: Schema.NumberFromString,
});

// Throw on-load if missing
const config = Schema.parseSync(envValidationSchema)(process.env);

const pool = new Pool({
  user: config.DB_USER,
  host: config.DB_HOST,
  database: config.DB_NAME,
  password: config.DB_PASSWORD,
  port: config.DB_PORT,
});

pool.on('error', (err) => {
  // don't let a pg restart kill the app
  console.error(err);
});

export {pool, db};
