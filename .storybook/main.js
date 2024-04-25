/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ['../app/components/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
    '@chromatic-com/storybook',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {
      builder: {
        viteConfigPath: 'storybook.vite.config.ts',
      },
    },
  },
  docs: {
    autodocs: 'tag',
  },
};
export default config;
