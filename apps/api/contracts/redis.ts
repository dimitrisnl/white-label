import {InferConnectionsFromConfig} from '@adonisjs/redis/build/config';

import redisConfig from '../config/redis';

declare module '@ioc:Adonis/Addons/Redis' {
  interface RedisConnectionsList
    extends InferConnectionsFromConfig<typeof redisConfig> {}
}
