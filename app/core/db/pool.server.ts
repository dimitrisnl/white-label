import Pg from 'pg';

import {config} from './config.server';

function makePool() {
  return new Pg.Pool({
    user: config.DB_USER,
    host: config.DB_HOST,
    database: config.DB_NAME,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
  });
}

let pool: ReturnType<typeof makePool>;

declare global {
  // eslint-disable-next-line no-var
  var __pool: ReturnType<typeof makePool> | undefined;
}

if (process.env.NODE_ENV === 'production') {
  pool = makePool();
} else {
  if (!global.__pool) {
    global.__pool = makePool();
  }
  pool = global.__pool;
}

pool.on('error', (err) => {
  // don't let a pg restart kill the app
  console.error(err);
});

export {pool};
