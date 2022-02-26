import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import typescript from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

export default {
  input: './src/sandbox/App.tsx',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    sourcemap: true,
  },
  plugins: [
    nodeResolve({
      extensions: ['.js', '.ts', '.tsx'],
    }),
    typescript({ useTsconfigDeclarationDir: true }),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    babel({
      presets: ['@babel/preset-react'],
    }),
    commonjs(),
    serve({
      open: true,
      verbose: true,
      contentBase: ['', './public'],
      host: 'localhost',
      port: 3000,
    }),
    livereload({ watch: ['dist'] }),
  ],
};
