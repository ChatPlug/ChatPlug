import fs from 'fs-extra'
import { exec as pkg } from 'pkg'
import path from 'path'
import runCommand from './runCommand'
import { flag } from './buildTool'
import loggingHelper from './loggingHelper'
import os from 'os'

export default async function packageApp(usedModules: string[]) {
  usedModules.push('sqlite3') // include sqlite3 even if it isn't directly required

  // prepare the binaries directory
  await fs.mkdirp(path.resolve(__dirname, '../dist-bin'))

  const fullPackage = await fs.readJSON(
    path.resolve(__dirname, '../package.json'),
  )
  const allDependencies = {
    ...fullPackage.dependencies,
    ...fullPackage.devDependencies,
  }
  const depndenciesToPackage: { [x: string]: string } = {}

  // only copy packages used by the app directly
  Object.keys(allDependencies)
    .filter(dep => usedModules.includes(dep))
    .forEach(dep => (depndenciesToPackage[dep] = allDependencies[dep]))
  const packagePath = path.resolve(__dirname, '../dist/package.json')
  // save the new package with some extra data for PKG
  await fs.writeJSON(packagePath, {
    ...fullPackage,
    scripts: undefined, // unset scripts, useless in built app
    devDependencies: undefined,
    dependencies: depndenciesToPackage,
    bin: 'chatplug.js',
    pkg: {
      scripts: [],
      assets: [
        'dashboard-web/**/*',
        'services/**/*.json',
        'services/**/*.js',
        'chatplug.lib.js',
        'chatplug.js',
      ],
    },
  })
  await runCommand('npm install', path.resolve(__dirname, '../dist/'))
  if (flag('--node-prune')) {
    await runCommand('node-prune', path.resolve(__dirname, '../dist/'))
  } else {
    loggingHelper.warn(
      'Pruning of node_modules is disabled, install node-prune and run with --node-prune for smaller binaries.',
    )
  }
  console.log({ packagePath })

  const targetMatrix: { [key in NodeJS.Platform]?: string } = {
    darwin: 'macos',
    win32: 'win',
    linux: 'linux-x64,linux-x86,linux-armv7,',
  }
  const nicePlatformNames: { [key in NodeJS.Platform]?: string } = {
    darwin: 'macos',
    win32: 'windows',
    linux: 'linux',
  }
  const target = targetMatrix[os.platform()]

  if (!target) {
    throw new Error(`Unsupported build platform ${os.platform()}.`)
  }

  await pkg([
    packagePath,
    '--output',
    path.resolve(
      __dirname,
      `../dist-bin/chatplug-${process.env.TRAVIS_TAG || 'dev'}-${
        nicePlatformNames[os.platform()]
      }`,
    ),
    '--target',
    target,
    '--public',
  ])
}
