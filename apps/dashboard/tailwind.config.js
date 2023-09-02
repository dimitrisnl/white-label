/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@white-label/ui-core/tailwind-config')],
  content: [
    './app/**/*.{ts,tsx}',
    './node_modules/@white-label/ui-core/**/*.{ts,tsx}',
  ],
};
