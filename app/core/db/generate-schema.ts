import * as Schema from '@effect/schema/Schema';
import * as zg from 'zapatos/generate';

const envValidationSchema = Schema.Struct({
  DB_USER: Schema.String.pipe(Schema.minLength(2)),
  DB_HOST: Schema.String.pipe(Schema.minLength(2)),
  DB_NAME: Schema.String.pipe(Schema.minLength(2)),
  DB_PASSWORD: Schema.String.pipe(Schema.minLength(2)),
  DB_SSL: Schema.String.pipe(Schema.nonEmpty()),
});

// Throw on-load if missing
const config = Schema.decodeUnknownSync(envValidationSchema)(process.env);

const zapCfg: zg.Config = {
  db: {
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    ssl: config.DB_SSL === 'true',
  },
  progressListener: true,
  outDir: './types',
};

console.log('Generating types...');
(async () => {
  await zg.generate(zapCfg);
  console.log('Generated types!');
})().catch((error) => {
  console.log(error);
});
