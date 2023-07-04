import type {AuthConfig} from '@ioc:Adonis/Addons/Auth';

const authConfig: AuthConfig = {
  guard: 'api',
  guards: {
    api: {
      driver: 'oat',
      tokenProvider: {
        type: 'api',
        driver: 'redis',
        redisConnection: 'local',
        foreignKey: 'user_id',
      },

      provider: {
        driver: 'lucid',
        identifierKey: 'id',
        uids: ['email'],
        model: () => import('@/app/modules/user/models/User'),
      },
    },
  },
};

export default authConfig;
