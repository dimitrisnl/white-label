import User from '@/app/modules/user/models/User';

declare module '@ioc:Adonis/Addons/Auth' {
  interface ProvidersList {
    user: {
      implementation: LucidProviderContract<typeof User>;
      config: LucidProviderConfig<typeof User>;
    };
  }

  interface GuardsList {
    api: {
      implementation: OATGuardContract<'user', 'api'>;
      config: OATGuardConfig<'user'>;
      client: OATClientContract<'user'>;
    };
  }
}
