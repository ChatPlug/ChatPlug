import fs from 'fs-extra'
import { exec as pkg } from 'pkg'
import path from 'path'
import runCommand from './runCommand'
import { flag } from './buildTool'
import loggingHelper from './loggingHelper'
import os from 'os'
import PackagingTarget from './PackagingTarget'
import PkgPackagingTarget from './PkgPackagingTarget'
import { OutputPlatform, OutputArch } from './outputTypes'

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

  const packageContents = {
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
  }

  const packagingTargets: PackagingTarget[] = [
    new PkgPackagingTarget(OutputPlatform.linux, OutputArch.x64),
    new PkgPackagingTarget(OutputPlatform.linux, OutputArch.armv7),
    new PkgPackagingTarget(OutputPlatform.windows, OutputArch.x64),
    new PkgPackagingTarget(OutputPlatform.macos, OutputArch.x64),
  ]

  for (const target of packagingTargets) {
    await target.installDependencies(
      packageContents,
      path.resolve(__dirname, '../dist'),
    )
    await target.packageApp(path.resolve(__dirname, '../dist-bin'))
  }
}
