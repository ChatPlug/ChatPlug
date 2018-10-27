import webpack, { Configuration, Compiler } from 'webpack'
import path from 'path'
import externals from 'webpack-node-externals'
import loggingHelper from './loggingHelper'
import merge from 'webpack-merge'
import fs, { mkdirp } from 'fs-extra'
import buildService from './buildService'
import { exec } from 'child_process'
export function flag(f: string) {
  return process.argv.indexOf(f) !== -1
}

async function run() {
  const production = flag('--prod')
  const watch = flag('--watch')
  const compilers: (Compiler)[] = []
  const dist = path.resolve(__dirname, '../dist')
  loggingHelper.info('Production mode:', production)

  const doneClean = loggingHelper.timed('removing dist/ directory')
  await fs.remove(dist)
  doneClean()

  let nuxtBuildPromise: Promise<void> | null = null
  if (production) {
    nuxtBuildPromise = (async _ => {
      await new Promise((res, rej) => {
        let nuxtProc = exec(
          `${path.resolve(
            __dirname,
            '../src/services/dashboard/web/node_modules/.bin/nuxt',
          )} generate`,
          {
            cwd: path.resolve(__dirname, '../src/services/dashboard/web'),
          },
        )
        nuxtProc.stdout.pipe(process.stdout)
        nuxtProc.stderr.pipe(process.stderr)
        nuxtProc.on('exit', code => {
          if (code === 0) {
            res()
          } else {
            rej()
          }
        })
      })
      await fs.copy(
        path.resolve(__dirname, '../src/services/dashboard/web/dist'),
        path.resolve(__dirname, '../dist/dashboard-web'),
      )
    })()
  }
  const baseCfg: Configuration = {
    mode: production ? 'production' : 'development',
    target: 'node',
    module: {
      rules: [
        {
          test: /\.tsx?$/,

          use: [
            {
              loader: path.resolve(__dirname, './stripBuildMeta.ts'),
            },
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
              },
            },
          ],
          exclude: path.resolve(__dirname, '../src/services/dashboard/web'),
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.json', '.ts'],
    },
    externals: [externals()],
    node: {
      __dirname: false,
      __filename: false,
    },
    plugins: [
      new webpack.DefinePlugin({
        __REQUIRE_BYPASS_WEBPACK__: '(require)',
      }),
    ],
    optimization: {
      minimize: false,
    },
  }

  compilers.push(
    webpack(
      merge(baseCfg, {
        name: 'chatplug.lib',
        entry: [path.resolve(__dirname, '../src/index.ts')],
        output: {
          path: dist,
          filename: 'chatplug.lib.js',
          libraryTarget: 'commonjs2',
          library: 'chatplug',
        },
        plugins: [
          new webpack.DllPlugin({
            name: 'chatplug.lib',
            path: path.resolve(__dirname, '../dist/chatplug.lib.manifest.json'),
            context: path.resolve(__dirname, '../'),
          }),
        ],
      }),
    ),
  )

  compilers.push(
    webpack(
      merge(baseCfg, {
        name: 'chatplug',
        entry: [path.resolve(__dirname, '../src/bootstrap.ts')],
        output: {
          path: path.resolve(__dirname, '../dist'),
          filename: 'chatplug.js',
        },
        plugins: [
          new webpack.DllReferencePlugin({
            name: './chatplug.lib',
            context: path.resolve(__dirname, '../'),
            manifest: path.resolve(
              __dirname,
              '../dist/chatplug.lib.manifest.json',
            ),
            sourceType: 'commonjs2',
          }),
        ],
      }),
    ),
  )

  const servicesDirectory = path.resolve(__dirname, '../src/services')
  let serviceDirs = await fs.readdir(servicesDirectory)
  for (const s of serviceDirs) {
    const dirPath = path.join(servicesDirectory, s)
    if (!(await fs.stat(dirPath)).isDirectory()) {
      continue
    }
    let c = await buildService(dirPath, baseCfg)
    if (c) {
      compilers.push(c)
    }
  }

  for (const compiler of compilers) {
    if (!compiler) {
      throw new Error('Compiler is undefined')
    }
    const done = loggingHelper.timed(`Compiled ${compiler.options.name}`)
    await new Promise(res =>
      compiler.run(d => {
        done()
        res()
      }),
    )
  }

  if (watch) {
    for (const compiler of compilers) {
      if (!compiler) {
        throw new Error('Compiler is undefined')
      }
      compiler.hooks.watchRun.tap('watchNotifier', _ => {
        loggingHelper.info(`Compiling ${compiler.options.name}`)
      })
      compiler.watch(
        {
          aggregateTimeout: 1000,
          poll: 1000,
        },
        (err, stats) => {
          loggingHelper.info(`Compiled ${compiler.options.name}`)
          if (err) {
            console.log(err)
          }
        },
      )
    }
  }
  if (production) {
    await nuxtBuildPromise
  }
}

run().then(_ => _, console.error)
