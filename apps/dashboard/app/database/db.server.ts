import 'dotenv/config';

import {Pool} from 'pg';
import * as db from 'zapatos/db';
import zod from 'zod';

const envValidationSchema = zod.object({
  DB_USER: zod.string().min(2),
  DB_HOST: zod.string().min(2),
  DB_NAME: zod.string().min(2),
  DB_PASSWORD: zod.string().min(2),
  DB_PORT: zod.coerce.number(),
});

// Throw on-load if missing
const config = envValidationSchema.parse(process.env);

const pool = new Pool({
  user: config.DB_USER,
  host: config.DB_HOST,
  database: config.DB_NAME,
  password: config.DB_PASSWORD,
  port: config.DB_PORT,
});

pool.on('error', (err) => console.error(err)); // don't let a pg restart kill your app

export {pool, db};
