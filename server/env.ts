import Env from '@ioc:Adonis/Core/Env';

export default Env.rules({
  // Misc
  HOST: Env.schema.string({format: 'host'}),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  APP_NAME: Env.schema.string(),
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  FE_URL: Env.schema.string(),
  BE_URL: Env.schema.string(),
  // Disk
  DRIVE_DISK: Env.schema.enum(['local'] as const),
  // Database
  DB_CONNECTION: Env.schema.string(),
  PG_HOST: Env.schema.string({format: 'host'}),
  PG_PORT: Env.schema.number(),
  PG_USER: Env.schema.string(),
  PG_PASSWORD: Env.schema.string.optional(),
  PG_DB_NAME: Env.schema.string(),
  // SMTP
  SMTP_HOST: Env.schema.string(),
  SMTP_PORT: Env.schema.number(),
  SMTP_USERNAME: Env.schema.string(),
  SMTP_PASSWORD: Env.schema.string(),
  // Hashing
  HASH_DRIVER: Env.schema.enum(['bcrypt', 'scrypt', 'argon'] as const),
  // Logs
  LOG_LEVEL: Env.schema.enum([
    'debug',
    'info',
    'warn',
    'error',
    'silent',
  ] as const),
  // Reddis
  REDIS_CONNECTION: Env.schema.enum(['local'] as const),
  REDIS_HOST: Env.schema.string({format: 'host'}),
  REDIS_PORT: Env.schema.number(),
  REDIS_PASSWORD: Env.schema.string.optional(),
});
