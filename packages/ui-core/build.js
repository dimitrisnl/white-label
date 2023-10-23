import * as esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['./src/**/*.ts', './src/**/*.tsx'],
  bundle: true,
  minify: true,
  sourcemap: true,
  platform: 'browser',
  splitting: true,
  format: 'esm',
  outdir: './dist',
  external: ['react', 'react-dom', '@heroicons/react', 'tailwindcss'],
});
