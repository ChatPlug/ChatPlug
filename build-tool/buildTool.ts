import webpack, { Configuration, Compiler } from 'webpack'
import path from 'path'
import externals from 'webpack-node-externals'
import loggingHelper from './loggingHelper'
import merge from 'webpack-merge'
import fs, { mkdirp } from 'fs-extra'
import buildService from './buildService'

function flag(f: string) {
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
              // options: {
              //   transpileOnly: true,
              // },
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
  }

  compilers.push(
    webpack(
      merge(baseCfg, {
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
    const done = loggingHelper.timed(
      `Done compiling of ${(compiler as any).options.output.path}`,
    )
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
      compiler.watch(
        {
          aggregateTimeout: 300,
          poll: undefined,
        },
        (err, stats) => {
          console.log('Compiled while watching', err)
        },
      )
    }
  }
}

run().then(_ => _, console.error)
