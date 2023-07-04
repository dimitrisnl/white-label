import Env from '@ioc:Adonis/Core/Env';
import type {LoggerConfig} from '@ioc:Adonis/Core/Logger';
import type {ProfilerConfig} from '@ioc:Adonis/Core/Profiler';
import type {ServerConfig} from '@ioc:Adonis/Core/Server';
import type {ValidatorConfig} from '@ioc:Adonis/Core/Validator';
import proxyAddr from 'proxy-addr';

export const appKey: string = Env.get('APP_KEY');

export const http: ServerConfig = {
  allowMethodSpoofing: false,
  subdomainOffset: 2,
  generateRequestId: false,
  trustProxy: proxyAddr.compile('loopback'),
  etag: false,
  jsonpCallbackName: 'callback',

  cookie: {
    domain: '',
    path: '/',
    maxAge: '2h',
    httpOnly: true,
    secure: false,
    sameSite: false,
  },

  forceContentNegotiationTo: 'application/json',
  useAsyncLocalStorage: true,
};

export const logger: LoggerConfig = {
  name: Env.get('APP_NAME'),
  enabled: true,
  level: Env.get('LOG_LEVEL', 'info'),
  prettyPrint: Env.get('NODE_ENV') === 'development',
};

export const profiler: ProfilerConfig = {
  enabled: true,
  blacklist: [],
  whitelist: [],
};

export const validator: ValidatorConfig = {};
