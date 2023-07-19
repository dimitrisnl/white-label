import type {InferDisksFromConfig} from '@adonisjs/core/build/config';

import type driveConfig from '../config/drive';

declare module '@ioc:Adonis/Core/Drive' {
  interface DisksList extends InferDisksFromConfig<typeof driveConfig> {}
}
