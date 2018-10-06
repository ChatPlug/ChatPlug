import webpack, { Configuration } from 'webpack'
import path from 'path'
import loggingHelper from './loggingHelper'
import merge from 'webpack-merge'
import fs from 'fs-extra'

export default async function buildService(
  sourcePath: string,
  baseWebpackConfig: Configuration,
) {
  const serviceName = path.basename(sourcePath)
  if (!(await fs.pathExists(path.resolve(sourcePath, 'manifest.json')))) {
    loggingHelper.warn(
      `Service ${serviceName} has no manifest, skipping build.`,
    )
    return
  }

  const done = loggingHelper.timed(`building service ${serviceName}`)
  const outDir = path.resolve(__dirname, '../dist/services/', serviceName)

  await new Promise((res, rej) =>
    webpack(
      merge(baseWebpackConfig, {
        entry: path.resolve(sourcePath, 'index.ts'),
        name: serviceName,
        output: {
          path: outDir,
          filename: 'index.js',
          library: serviceName,
          libraryTarget: 'commonjs2',
        },
        plugins: [
          new webpack.DllReferencePlugin({
            name: '../../chatplug.lib',
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
        done()
        if (err || stats.hasErrors()) {
          // Handle errors here
          console.error(stats.toString())
          rej(err)
        }
        res()
        // Done processing
      },
    ),
  )
}
