import webpack, { Configuration, Compiler } from 'webpack'
import path from 'path'
import externals from 'webpack-node-externals'
import loggingHelper from './loggingHelper'
import merge from 'webpack-merge'
import fs from 'fs-extra'
import buildService from './buildService'
import buildDashboard from './buildDashboard'
import packageApp from './packageApp'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'

export function flag(f: string) {
  return process.argv.indexOf(f) !== -1
}

async function run() {
  const production = flag('--prod')
  const watch = flag('--watch')
  const packageMode = flag('--pkg')

  const compilers: (Compiler)[] = []
  const dist = path.resolve(__dirname, '../dist')
  loggingHelper.info('Production mode:', production)

  const doneClean = loggingHelper.timed('removing dist/ directory')
  await fs.remove(dist)
  doneClean()

  let nuxtBuildPromise: Promise<void> | null = null
  if (production) {
    nuxtBuildPromise = buildDashboard()
  }
  const baseCfg: Configuration = {
    mode: production ? 'production' : 'development',
    target: 'node',
    devtool: packageMode || production ? false : undefined,
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
      new ForkTsCheckerWebpackPlugin(),
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
  const serviceDirs = await fs.readdir(servicesDirectory)
  for (const s of serviceDirs) {
    const dirPath = path.join(servicesDirectory, s)
    if (!(await fs.stat(dirPath)).isDirectory()) {
      continue
    }
    const c = await buildService(dirPath, baseCfg)
    if (c) {
      compilers.push(c)
    }
  }

  /**
   * A list of modules which need to be packaged with the app.
   */
  let externalModules: string[] = []
  for (const compiler of compilers) {
    if (!compiler) {
      throw new Error('Compiler is undefined')
    }
    const done = loggingHelper.timed(`Compiled ${compiler.options.name}`)
    await new Promise((res, rej) =>
      compiler.run((err, stats) => {
        if (err) {
          return rej(err)
        }
        externalModules = [
          ...externalModules,
          ...stats.compilation.modules
            .filter(
              m =>
                ['commonjs', 'commonjs2'].includes(m.externalType) &&
                !m.request.startsWith('.'),
            )
            .map(m => m.request),
        ]
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
          loggingHelper.info(
            `Compiled ${compiler.options.name} in ${stats.toJson().time}ms`,
          )
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
  if (packageMode) {
    await packageApp(externalModules)
  }
}

run().then(
  _ => _,
  err => {
    console.error(err)
    process.exit(-1021)
  },
)
