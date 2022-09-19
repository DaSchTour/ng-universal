// rollup.config.js
/**
 * @type {import('rollup').RollupOptions}
 */

import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

const config = [
  {
    input: 'lib/index.ts',
    external: [
      'express',
      'memory-cache',
      'reflect-metadata',
      'path',
      'fs',
      '@nestjs/core',
      '@nestjs/common',
      '@angular/common',
      '@nguniversal/express-engine'
    ],
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs'
      },
      {
        file: 'dist/index.mjs',
        format: 'es'
      }
    ],
    plugins: [typescript()]
  },
  {
    input: 'lib/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es'
    },
    plugins: [dts()]
  },
  {
    input: 'lib/tokens.ts',
    external: ['@nguniversal/express-engine/tokens'],
    output: [
      {
        file: 'dist/tokens.js',
        format: 'cjs'
      },
      {
        file: 'dist/tokens.mjs',
        format: 'es'
      }
    ],
    plugins: [typescript()]
  },
  {
    input: 'lib/tokens.ts',
    output: {
      file: 'dist/tokens.d.ts',
      format: 'es'
    },
    plugins: [dts()]
  },
  {
    input: 'lib/tokens.ts',
    output: {
      file: 'tokens/index.d.ts',
      format: 'es'
    },
    plugins: [dts()]
  }
];
export default config;
