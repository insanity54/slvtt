import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/cli.ts', 'src/main.ts'],
  dts: true,
  outDir: 'dist',
  format: ['esm'],
  target: 'node20',
});