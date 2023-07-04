process.env.NODE_ENV = 'test';

import 'reflect-metadata';

import {Ignitor} from '@adonisjs/core/build/standalone';
import {configure, processCliArgs, run, RunnerHooksHandler} from '@japa/runner';
import sourceMapSupport from 'source-map-support';

sourceMapSupport.install({handleUncaughtExceptions: false});

const kernel = new Ignitor(__dirname).kernel('test');

// eslint-disable-next-line @typescript-eslint/no-floating-promises
kernel
  .boot()
  .then(() => import('./tests/bootstrap'))
  .then(({runnerHooks, ...config}) => {
    const app: Array<RunnerHooksHandler> = [() => kernel.start()];

    configure({
      ...kernel.application.rcFile.tests,
      ...processCliArgs(process.argv.slice(2)),
      ...config,
      ...{
        importer: (filePath) => import(filePath),
        setup: app.concat(runnerHooks.setup),
        teardown: runnerHooks.teardown,
      },
      cwd: kernel.application.appRoot,
    });

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    run();
  });
