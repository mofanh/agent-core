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
    external: [
      'puppeteer',
      'playwright',
      '@modelcontextprotocol/sdk/server/index.js',
      '@modelcontextprotocol/sdk/server/stdio.js',
      '@modelcontextprotocol/sdk/client/index.js',
      '@modelcontextprotocol/sdk/client/stdio.js',
      '@modelcontextprotocol/sdk/types.js',
      'child_process'
    ],
    plugins: [
      resolve({
        preferBuiltins: true
      }),
      commonjs(),
      json(),
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
    external: [
      'puppeteer',
      'playwright',
      '@modelcontextprotocol/sdk/server/index.js',
      '@modelcontextprotocol/sdk/server/stdio.js',
      '@modelcontextprotocol/sdk/client/index.js',
      '@modelcontextprotocol/sdk/client/stdio.js',
      '@modelcontextprotocol/sdk/types.js',
      'child_process'
    ],
    plugins: [
      resolve({
        preferBuiltins: true
      }),
      commonjs(),
      json(),
      babel({
        babelHelpers: 'bundled',
        presets: ['@babel/preset-env'],
        extensions: ['.js'],
        exclude: 'node_modules/**'
      })
    ],
  },
  // UMD (浏览器环境，排除 Node.js 特定模块)
  {
    input: 'src/index.js',
    output: {
      file: 'lib/umd.js',
      format: 'umd',
      name: 'AgentCore',
    },
    external: [
      'puppeteer',
      'playwright',
      '@modelcontextprotocol/sdk/server/index.js',
      '@modelcontextprotocol/sdk/server/stdio.js',
      '@modelcontextprotocol/sdk/client/index.js',
      '@modelcontextprotocol/sdk/client/stdio.js',
      '@modelcontextprotocol/sdk/types.js',
      'child_process',
      'fs',
      'path',
      'url',
      'crypto',
      'events'
    ],
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: false
      }),
      commonjs(),
      json(),
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
    external: [
      'puppeteer',
      'playwright',
      '@modelcontextprotocol/sdk/server/index.js',
      '@modelcontextprotocol/sdk/server/stdio.js',
      '@modelcontextprotocol/sdk/client/index.js',
      '@modelcontextprotocol/sdk/client/stdio.js',
      '@modelcontextprotocol/sdk/types.js',
      'child_process'
    ],
    plugins: [
      resolve({
        preferBuiltins: true
      }),
      commonjs(),
      json(),
      babel({
        babelHelpers: 'bundled',
        presets: ['@babel/preset-env'],
        extensions: ['.js'],
        exclude: 'node_modules/**'
      })
    ],
  },
];
