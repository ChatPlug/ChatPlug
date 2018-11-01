import archiver from 'archiver';
import fs from 'fs-extra';
import glob from 'glob-promise';
import path from 'path';
import { exec as pkg } from 'pkg';
import loggingHelper from './loggingHelper';
import { OutputArch, OutputPlatform, OutputTypesUtils } from './outputTypes';
import PackagingTarget from './PackagingTarget';
import runCommand from './runCommand';

export default class PkgPackagingTarget implements PackagingTarget {
  distPreTempPath: string
  distPostTempPath: string
  constructor(public platform: OutputPlatform, public arch: OutputArch) {
    this.distPreTempPath = path.resolve(
      __dirname,
      `../dist-temp/pkg-pre-${this.platform}-${this.arch}/`,
    )
    this.distPostTempPath = path.resolve(
      __dirname,
      `../dist-temp/pkg-post-${this.platform}-${this.arch}/`,
    )
  }

  async installDependencies(packageContents: any, distDir: string) {
    loggingHelper.info(
      `Installing dependencies for ${this.platform}-${this.arch}`,
    )
    await fs.mkdirp(this.distPreTempPath)
    await fs.copy(distDir, this.distPreTempPath)
    await fs.writeJSON(
      path.join(this.distPreTempPath, 'package.json'),
      packageContents,
    )
    await runCommand(
      `npm install --target_arch=${OutputTypesUtils.archToNpmNames(
        this.arch,
      )} --target_platform=${OutputTypesUtils.platformToNpmName(
        this.platform,
      )}`,
      this.distPreTempPath,
    )
  }

  async packageApp(distBinPath: string) {
    loggingHelper.info(`Packaging app for ${this.platform}-${this.arch}`)
    await fs.mkdirp(this.distPostTempPath)
    const binaryName =
      this.platform === OutputPlatform.windows ? 'chatplug.exe' : 'chatplug'
    const target =
      OutputTypesUtils.platformToPkgName(this.platform) +
      ',' +
      OutputTypesUtils.archToPkgNames(this.arch)

    await pkg([
      this.distPreTempPath,
      '--output',
      path.join(this.distPostTempPath, binaryName),
      '--target',
      target,
      '--public',
    ])

    const nativeAddonsToCopy = await glob(
      path.join(this.distPreTempPath, 'node_modules/**/*.node'),
      { absolute: true },
    )

    // copy native addons
    await Promise.all(
      nativeAddonsToCopy.map(nativeAddon =>
        fs.copy(
          nativeAddon,
          path.join(this.distPostTempPath, path.basename(nativeAddon)),
        ),
      ),
    )

    const archive = archiver('zip', {
      zlib: {
        level: 9,
      },
    })

    const outputStream = fs.createWriteStream(
      path.join(
        distBinPath,
        `chatplug-${process.env.TRAVIS_TAG || 'dev'}-${this.platform}-${
          this.arch
        }.zip`,
      ),
    )
    const endPromise = new Promise((res, rej) => {
      outputStream.on('close', res)
    })
    archive.pipe(outputStream)
    archive.directory(this.distPostTempPath, false)
    archive.finalize()
    await endPromise
  }
}
