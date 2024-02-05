import type Pg from 'pg';
import type * as db from 'zapatos/db';

export type PgPool = Pg.Pool;
export type DB = typeof db;
