import * as Effect from 'effect/Effect';

import {sendEmail} from '@/mailer/send-email.server.ts';

import {registerQueue} from './register-queue.server.ts';

interface JobPayload {
  to: string;
  content: string;
  subject: string;
}

const emailQueue = registerQueue<JobPayload>('email', async (job) => {
  const {to, content, subject} = job.data;
  console.log(`Sending email to ${to}, subject: ${subject}`);
  await sendEmail({to, content, subject});
});

export const addEmailJob = (jobName: string, jobPayload: JobPayload) => {
  return Effect.gen(function* (_) {
    yield* _(Effect.promise(() => emailQueue.add(jobName, jobPayload)));
  });
};
