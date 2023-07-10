import type {InferListFromConfig} from '@adonisjs/core/build/config';

import type hashConfig from '../config/hash';

declare module '@ioc:Adonis/Core/Hash' {
  interface HashersList extends InferListFromConfig<typeof hashConfig> {}
}
