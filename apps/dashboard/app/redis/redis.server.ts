import {Redis} from 'ioredis';

import {config} from './config.server.ts';

function makeRedis() {
  return new Redis({
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    password: config.REDIS_PASSWORD,
    maxRetriesPerRequest: null,
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
