import {Redis} from 'ioredis';

import {config} from './config.server.ts';

function makeRedis() {
  return config.REDIS_TLS === 'true'
    ? new Redis(
        `rediss://${config.REDIS_USER}:${config.REDIS_PASSWORD}@${config.REDIS_HOST}:${config.REDIS_PORT}`
      )
    : new Redis({
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
        password: config.REDIS_PASSWORD,
        maxRetriesPerRequest: 0,
      });
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
