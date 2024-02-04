import * as Schema from '@effect/schema/Schema';
import {createCookieSessionStorage} from '@remix-run/node';
import {createThemeSessionResolver} from 'remix-themes';

const envValidationSchema = Schema.struct({
  SESSION_SECRET: Schema.string.pipe(Schema.nonEmpty()),
});
const config = Schema.decodeUnknownSync(envValidationSchema)(process.env);

const themeSessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__theme',
    path: '/',
    secrets: [config.SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production', // add domain
    sameSite: 'lax',
    httpOnly: true,
    maxAge: 0,
  },
});

export const themeSessionResolver =
  createThemeSessionResolver(themeSessionStorage);
