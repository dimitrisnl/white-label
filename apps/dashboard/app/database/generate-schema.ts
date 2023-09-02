import * as zg from 'zapatos/generate';
import zod from 'zod';

const envValidationSchema = zod.object({
  DB_USER: zod.string().min(2),
  DB_HOST: zod.string().min(2),
  DB_NAME: zod.string().min(2),
  DB_PASSWORD: zod.string().min(2),
  DB_SSL: zod.string(),
});

const config = envValidationSchema.parse(process.env);

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
