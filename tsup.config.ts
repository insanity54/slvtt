import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/main.ts', 'src/cli.ts'],
  dts: true,
  outDir: 'dist',
  format: ['esm'],
  target: 'node20',
  clean: true,
});