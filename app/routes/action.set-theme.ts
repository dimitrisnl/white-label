import {createThemeAction} from 'remix-themes';

import {themeSessionResolver} from '~/core/lib/theme.server';

export const action = createThemeAction(themeSessionResolver);
