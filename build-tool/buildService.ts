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
    return null
  }

  const done = loggingHelper.timed(`building service ${serviceName}`)
  const outDir = path.resolve(__dirname, '../dist/services/', serviceName)

  return webpack(
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
          manifest: path.resolve(
            __dirname,
            '../dist/chatplug.lib.manifest.json',
          ),
          sourceType: 'commonjs2',
        }),
        new webpack.DefinePlugin({
          'process.env.CHATPLUG_DASHBOARD_DEV_HTTP_HANDLER': `${JSON.stringify(
            path.resolve(
              __dirname,
              '../src/services/dashboard/web/dashboardHttpHandler',
            ),
          )}`,
        }),
      ],
    }),
  )
}
