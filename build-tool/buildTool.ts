import webpack from 'webpack'
import path from 'path'
import externals from 'webpack-node-externals'
import loggingHelper from './loggingHelper'

function flag(f: string) {
  return process.argv.indexOf(f) !== -1
}


async function run() {
  const production = flag('--prod')
  loggingHelper.info('Production mode:', production)
  const done = loggingHelper.timed('Finished main webpack build')
  webpack(
    {
      mode: production ? 'production' : 'development',
      target: 'node',
      entry: path.resolve(__dirname, '../src/index.ts'),
      output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'chatplug.js',
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            loader: 'ts-loader',
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
          __filename: false
      }
    },
    (err, stats) => {
      done()
      if (err || stats.hasErrors()) {
        // Handle errors here
        console.error(stats.toString())
      }

      // Done processing
    },
  )
}

run().then(_ => _, console.error)
