import {
  createSessionStorage,
  type SessionIdStorageStrategy,
  type SessionStorage,
} from '@remix-run/node';
import {randomBytes as cryptoRandomBytes} from 'crypto';
import type * as Redis from 'ioredis';

function genRandomID(): string {
  const randomBytes = cryptoRandomBytes(8);
  return Buffer.from(randomBytes).toString('hex');
}

const expiresToSeconds = (expires: Date) => {
  const now = new Date();
  const expiresDate = new Date(expires);
  const secondsDelta = Math.round(
    (expiresDate.getTime() - now.getTime()) / 1000
  );
  return secondsDelta < 0 ? 0 : secondsDelta;
};

interface redisSessionArguments {
  cookie: SessionIdStorageStrategy['cookie'];
  options: {
    redisClient: Redis.Redis;
  };
}

export function createRedisSessionStorage({
  cookie,
  options,
}: redisSessionArguments): SessionStorage {
  const redis: Redis.Redis = options.redisClient;

  return createSessionStorage({
    cookie,
    async createData(data, expires) {
      const id = genRandomID();
      if (expires) {
        await redis.set(
          id,
          JSON.stringify(data),
          'EX',
          expiresToSeconds(expires)
        );
      } else {
        await redis.set(id, JSON.stringify(data));
      }
      return id;
    },
    // @ts-expect-error
    async readData(id) {
      const data = await redis.get(id);
      if (data) {
        return JSON.parse(data);
      }
      return null;
    },
    async updateData(id, data, expires) {
      if (expires) {
        await redis.set(
          id,
          JSON.stringify(data),
          'EX',
          expiresToSeconds(expires)
        );
      } else {
        await redis.set(id, JSON.stringify(data));
      }
    },
    async deleteData(id) {
      await redis.del(id);
    },
  });
}
