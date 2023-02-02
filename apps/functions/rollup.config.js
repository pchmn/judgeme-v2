import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import renameNodeModules from "rollup-plugin-rename-node-modules";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'es',
    sourcemap: true,
    preserveModules: true,
    preserveModulesRoot: 'src',
  },
  external: [...Object.keys(pkg.dependencies).filter((key) => key !== '@kavout/core')],
  plugins: [
    typescript(),
    nodeResolve({
      extensions: ['.ts', '.js'],
    }),
    renameNodeModules('external')
  ],
};
