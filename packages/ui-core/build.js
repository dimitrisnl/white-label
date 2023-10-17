import * as esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['./src/**/*.ts', './src/**/*.tsx'],
  bundle: true,
  minify: true,
  sourcemap: true,
  platform: 'browser',
  format: 'esm',
  outdir: './dist',
  external: [
    'react',
    'react-dom',
    '@heroicons/react',
    'tailwind-merge',
    'clsx',
    'class-variance-authority',
  ],
});
