import {createThemeAction} from 'remix-themes';

import {themeSessionResolver} from '~/core/lib/session.server';

export const action = createThemeAction(themeSessionResolver);
