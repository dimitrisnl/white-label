// import {render} from '@white-label/email-templates/render';
import * as Effect from 'effect/Effect';

// export function buildTemplate(template: React.ReactElement) {
export function buildTemplate() {
  return Effect.try({
    // eslint-disable-next-line
    try: () => '<div>foo</div>',
    catch: () => {
      return Effect.fail('Failed to render email template');
    },
  });
}
