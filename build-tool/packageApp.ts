import fs from 'fs-extra'
import { exec as pkg } from 'pkg'
import path from 'path'

import runCommand from './runCommand'
import { flag } from './buildTool'
import loggingHelper from './loggingHelper'

export default async function packageApp(usedModules: string[]) {
  await fs.mkdirp(path.resolve(__dirname, '../dist-bin'))
  const fullPackage = await fs.readJSON(
    path.resolve(__dirname, '../package.json'),
  )
  const allDependencies = {
    ...fullPackage.dependencies,
    ...fullPackage.devDependencies,
  }
  const depndenciesToPackage = {}
  Object.keys(allDependencies)
    .filter(dep => usedModules.includes(dep))
    .forEach(dep => (depndenciesToPackage[dep] = allDependencies[dep]))
  const packagePath = path.resolve(__dirname, '../dist/package.json')
  await fs.writeJSON(packagePath, {
    name: 'ChatPlug',
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
  pkg([packagePath, '--out-path', path.resolve(__dirname, '../dist-bin')])
}
