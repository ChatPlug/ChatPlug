import webpack, { Configuration } from 'webpack'
import path from 'path'
import loggingHelper from './loggingHelper'
import merge from 'webpack-merge'
import fs from 'fs-extra'
import { flag } from './buildTool'

export default async function buildService(
  sourcePath: string,
  baseWebpackConfig: Configuration,
) {
  const prod = flag('--prod')
  const serviceName = path.basename(sourcePath)
  const outDir = path.resolve(__dirname, '../dist/services/', serviceName)
  const manifestPath = path.resolve(sourcePath, 'manifest.json')
  if (!(await fs.pathExists(manifestPath))) {
    loggingHelper.warn(
      `Service ${serviceName} has no manifest, skipping build.`,
    )
    return null
  }

  await fs.copy(manifestPath, path.resolve(outDir, 'manifest.json'))

  const done = loggingHelper.timed(`building service ${serviceName}`)
  let defineFields = {}
  if (prod) {
    defineFields['process.env.CHATPLUG_DASHBOARD_STATIC_DIR'] = JSON.stringify(
      './dashboard-web/',
    )
  } else {
    defineFields[
      'process.env.CHATPLUG_DASHBOARD_DEV_HTTP_HANDLER'
    ] = JSON.stringify(
      path.resolve(
        __dirname,
        '../src/services/dashboard/web/dashboardHttpHandler',
      ),
    )
  }
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
        new webpack.DefinePlugin(defineFields),
      ],
    }),
  )
}
