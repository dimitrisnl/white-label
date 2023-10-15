import {render} from '@white-label/email-templates';
import * as Effect from 'effect/Effect';

export function buildTemplate(template: React.ReactElement) {
  return Effect.try({
    // eslint-disable-next-line
    try: () => render(template),
    catch: () => {
      Effect.log('Failed to render email template');
      return Effect.fail('Failed to render email template');
    },
  });
}
