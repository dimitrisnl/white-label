/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('ui-core/tailwind-config')],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './node_modules/ui-core/**/*.{ts,tsx}',
  ],
};
