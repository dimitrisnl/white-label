import {render} from '@white-label/email-templates/render';
import * as Effect from 'effect/Effect';

export function buildTemplate(template: React.ReactElement) {
  return Effect.try({
    // eslint-disable-next-line
    try: () => render(template),
    catch: () => {
      return Effect.fail('Failed to render email template');
    },
  });
}
