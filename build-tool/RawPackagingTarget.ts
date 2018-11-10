import PackagingTarget from './PackagingTarget'
import fs from 'fs-extra'
import path from 'path'
import runCommand from './runCommand'
import { exec as pkg } from 'pkg'
import { OutputPlatform, OutputArch, OutputTypesUtils } from './outputTypes'
import glob from 'glob-promise'
import archiver from 'archiver'
import loggingHelper from './loggingHelper'

export default class RawPackagingTarget implements PackagingTarget {
  distRawTemp: string
  constructor() {
    this.distRawTemp = path.resolve(
      __dirname,
      '../dist-temp/raw/',
    )

  }

  async installDependencies(packageContents: any, distDir: string) {
    loggingHelper.info(
      'Preparing package.json for raw zip',
    )
    await fs.mkdirp(this.distRawTemp)
    await fs.copy(distDir, this.distRawTemp)
    await fs.writeJSON(
      path.join(this.distRawTemp, 'package.json'),
      packageContents,
    )
  }

  async packageApp(distBinPath: string) {
    loggingHelper.info('Packaging app for raw zip')

    const archive = archiver('zip', {
      zlib: {
        level: 9,
      },
    })

    const outputStream = fs.createWriteStream(
      path.join(
        distBinPath,
        `chatplug-${process.env.TRAVIS_TAG || 'dev'}-raw.zip`,
      ),
    )
    const endPromise = new Promise((res, rej) => {
      outputStream.on('close', res)
    })
    archive.pipe(outputStream)
    archive.directory(this.distRawTemp, false)
    archive.finalize()
    await endPromise
  }
}
