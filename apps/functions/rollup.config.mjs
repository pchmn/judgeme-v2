import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const pkg = require('./package.json');

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'cjs',
    sourcemap: true,
  },
  external: [...Object.keys(pkg.dependencies).filter((key) => key !== '@kuzpot/core')],
  plugins: [typescript(), nodeResolve(), json(), commonjs()],
};
