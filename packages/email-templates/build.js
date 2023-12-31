import * as esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['./src/**/*.ts', './src/**/*.tsx'],
  bundle: true,
  minify: true,
  sourcemap: false,
  platform: 'node',
  splitting: true,
  format: 'esm',
  outdir: './dist',
  external: ['react', 'react-dom'],
});
