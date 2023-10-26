import config from '@white-label/ui-core/tailwind-config';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [config],
  content: [
    './app/**/*.{ts,tsx}',
    './node_modules/@white-label/ui-core/**/*.{ts,tsx}',
  ],
};
