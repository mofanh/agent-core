import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { babel } from '@rollup/plugin-babel';

export default [
  // CommonJS
  {
    input: 'src/index.js',
    output: {
      file: 'lib/cjs.js',
      format: 'cjs',
      exports: 'named',
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        presets: ['@babel/preset-env'],
        extensions: ['.js'],
        exclude: 'node_modules/**'
      })
    ],
  },
  // ES Module
  {
    input: 'src/index.js',
    output: {
      file: 'lib/m.js',
      format: 'esm',
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        presets: ['@babel/preset-env'],
        extensions: ['.js'],
        exclude: 'node_modules/**'
      })
    ],
  },
  // UMD
  {
    input: 'src/index.js',
    output: {
      file: 'lib/umd.js',
      format: 'umd',
      name: 'DemoLib',
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        presets: ['@babel/preset-env'],
        extensions: ['.js'],
        exclude: 'node_modules/**'
      })
    ],
  },
  // AMD
  {
    input: 'src/index.js',
    output: {
      file: 'lib/amd.js',
      format: 'amd',
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        presets: ['@babel/preset-env'],
        extensions: ['.js'],
        exclude: 'node_modules/**'
      })
    ],
  },
];
