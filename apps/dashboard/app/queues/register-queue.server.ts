import type {Processor} from 'bullmq';
import {QueueEvents} from 'bullmq';
import {Queue, Worker} from 'bullmq';

import {redis as connection} from '../redis/redis.server';
import {registeredQueues} from './registered-queues.server';

type AugmentedQueue<T> = Queue<T> & {
  events: QueueEvents;
};

const CONCURRENCY = 8;
const LOCK_DURATION = 1000 * 60 * 15;

export function registerQueue<T>(name: string, processor: Processor<T>) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!registeredQueues[name]) {
    const queue = new Queue(name, {connection});
    const queueEvents = new QueueEvents(name, {
      connection,
    });
    const worker = new Worker<T>(name, processor, {
      connection,
      lockDuration: LOCK_DURATION,
      concurrency: CONCURRENCY,
    });
    registeredQueues[name] = {
      queue,
      queueEvents,
      worker,
    };
  }
  const queue = registeredQueues[name].queue as AugmentedQueue<T>;
  queue.events = registeredQueues[name].queueEvents;
  return queue;
}
