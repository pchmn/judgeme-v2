import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pkg = require('./package.json');

export default {
  input: 'src/index.ts',
  external: [...Object.keys(pkg.dependencies).filter((key) => key !== '@kavout/core')],
  plugins: [
    typescript(),
    nodeResolve({
      extensions: ['.ts', '.js'],
    }),
  ],
  onwarn: () => {
    return;
  },
  output: {
    file: 'dist/index.js',
    format: 'es',
    sourcemap: true,
  },
  inlineDynamicImports: true,
};
