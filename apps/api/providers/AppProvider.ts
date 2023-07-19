import type {ApplicationContract} from '@ioc:Adonis/Core/Application';

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  register() {
    console.log('AppProvider.register()');
  }

  async boot() {
    // IoC container is ready
    console.log('AppProvider.boot()');
    await Promise.resolve();
  }

  async ready() {
    // App is ready
    console.log('AppProvider.ready()');
    await Promise.resolve();
  }

  async shutdown() {
    // Cleanup, since app is going down
    console.log('AppProvider.shutdown()');
    await Promise.resolve();
  }
}
