import {Redis} from 'ioredis';

import {config} from './config.server.ts';

function makeRedis() {
  return new Redis(
    `rediss://${config.REDIS_USER}:${config.REDIS_PASSWORD}@${config.REDIS_HOST}:${config.REDIS_PORT}`,
    {
      maxRetriesPerRequest: null,
      lazyConnect: true,
      retryStrategy(times) {
        if (times > 20) return null; // return null to stop retrying
        return Math.min(times * 500, 2000);
      },
    }
  );
}

let redis: ReturnType<typeof makeRedis>;

declare global {
  // eslint-disable-next-line no-var
  var __redis: ReturnType<typeof makeRedis> | undefined;
}

if (process.env.NODE_ENV === 'production') {
  redis = makeRedis();
} else {
  if (!global.__redis) {
    global.__redis = makeRedis();
  }
  redis = global.__redis;
}

export {redis};
