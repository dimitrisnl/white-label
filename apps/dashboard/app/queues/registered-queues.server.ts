import {Queue, QueueEvents, Worker} from 'bullmq';

export interface RegisteredQueue {
  queue: Queue;
  queueEvents: QueueEvents;
  worker: Worker;
}

declare global {
  // eslint-disable-next-line no-var
  var __registeredQueues: Record<string, RegisteredQueue> | undefined;
}

if (!global.__registeredQueues) {
  global.__registeredQueues = {};
}

const registeredQueues: Record<string, RegisteredQueue> =
  global.__registeredQueues;

export {registeredQueues};
