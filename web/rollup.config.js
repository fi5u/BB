import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import svelte from 'rollup-plugin-svelte'
import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import nodePolyfills from 'rollup-plugin-node-polyfills'
import alias from '@rollup/plugin-alias'
import json from '@rollup/plugin-json'
import config from 'sapper/config/rollup.js'
import pkg from './package.json'
import path from 'path'

const mode = process.env.NODE_ENV
const dev = mode === 'development'
const legacy = !!process.env.SAPPER_LEGACY_BUILD

const onwarn = (warning, onwarn) =>
  warning.code === 'THIS_IS_UNDEFINED' ||
  (warning.code === 'CIRCULAR_DEPENDENCY' &&
    /[/\\]@sapper[/\\]/.test(warning.message)) ||
  onwarn(warning)

const dedupe = importee =>
  importee === 'svelte' || importee.startsWith('svelte/')

const aliasConfig = {
  entries: [
    {
      find: /^api\/(.*)/,
      replacement: path.resolve(__dirname, 'src/routes/api/$1'),
    },
    {
      find: /^components\/(.*)/,
      replacement: path.resolve(__dirname, 'src/components/$1'),
    },
    {
      find: /^config$/,
      replacement: path.resolve(__dirname, '../config.js'),
    },
    {
      find: /^routes\/(.*)/,
      replacement: path.resolve(__dirname, 'src/routes/$1'),
    },
    {
      find: /^server\/(.*)/,
      replacement: path.resolve(__dirname, 'src/server/$1'),
    },
    {
      find: /^stores\/(.*)/,
      replacement: path.resolve(__dirname, 'src/stores/$1'),
    },
    {
      find: /^utils\/(.*)/,
      replacement: path.resolve(__dirname, 'src/utils/$1'),
    },
  ],
}

export default {
  client: {
    input: config.client.input(),
    output: config.client.output(),
    plugins: [
      alias(aliasConfig),
      replace({
        'process.browser': true,
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      svelte({
        dev,
        hydratable: true,
        emitCss: true,
      }),
      resolve({
        browser: true,
        dedupe,
        preferBuiltins: true,
      }),
      commonjs(),
      nodePolyfills(),
      json(),

      legacy &&
        babel({
          extensions: ['.js', '.mjs', '.html', '.svelte'],
          runtimeHelpers: true,
          exclude: ['node_modules/@babel/**'],
          presets: [
            [
              '@babel/preset-env',
              {
                targets: '> 0.25%, not dead',
              },
            ],
          ],
          plugins: [
            '@babel/plugin-syntax-dynamic-import',
            [
              '@babel/plugin-transform-runtime',
              {
                useESModules: true,
              },
            ],
          ],
        }),

      !dev &&
        terser({
          module: true,
        }),
    ],

    onwarn,
  },

  server: {
    input: config.server.input(),
    output: config.server.output(),
    plugins: [
      alias(aliasConfig),
      replace({
        'process.browser': false,
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      svelte({
        generate: 'ssr',
        dev,
      }),
      resolve({
        dedupe,
      }),
      commonjs(),
      json(),
    ],
    external: Object.keys(pkg.dependencies).concat(
      require('module').builtinModules ||
        Object.keys(process.binding('natives'))
    ),

    onwarn,
  },

  serviceworker: {
    input: config.serviceworker.input(),
    output: config.serviceworker.output(),
    plugins: [
      resolve(),
      replace({
        'process.browser': true,
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      commonjs(),
      !dev && terser(),
      json(),
    ],

    onwarn,
  },
}
