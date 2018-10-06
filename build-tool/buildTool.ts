import webpack, { Configuration } from 'webpack'
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
  const doneLib = loggingHelper.timed('building chatplug.lib.js')
  await new Promise((res, rej) =>
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
      (err, stats) => {
        doneLib()
        if (err || stats.hasErrors()) {
          // Handle errors here
          console.error(stats.toString())
          rej(err)
          return
        }
        res()

        // Done processing
      },
    ),
  )

  const doneEntry = loggingHelper.timed('building chatplug.js executable')
  await new Promise((res, rej) =>
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
            manifest: require(path.resolve(
              __dirname,
              '../dist/chatplug.lib.manifest.json',
            )),
            sourceType: 'commonjs2',
          }),
        ],
      }),
      (err, stats) => {
        doneEntry()
        if (err || stats.hasErrors()) {
          // Handle errors here
          console.error(stats.toString())
          rej(err)
          return
        }
        res()

        // Done processing
      },
    ),
  )

  const servicesDirectory = path.resolve(__dirname, '../src/services')
  let serviceDirs = await fs.readdir(servicesDirectory)
  for (const s of serviceDirs) {
    const dirPath = path.join(servicesDirectory, s)
    if (!(await fs.stat(dirPath)).isDirectory()) {
      continue
    }

    await buildService(dirPath, baseCfg)
  }
}

run().then(_ => _, console.error)
