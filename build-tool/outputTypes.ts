import { Output } from 'webpack'

export enum OutputArch {
  x64 = 'x64',
  x86 = 'x86',
  armv7 = 'armv7',
}

export enum OutputPlatform {
  linux = 'linux',
  macos = 'macos',
  windows = 'windows',
}

export class OutputTypesUtils {
  static archToPkgNames(arch: OutputArch) {
    switch (arch) {
      case OutputArch.armv7:
        return 'armv7'
      case OutputArch.x64:
        return 'x64'
      case OutputArch.x86:
        return 'x86'
      default:
        throw new Error(`Unsupported pkg arch ${arch}`)
    }
  }

  static archToNpmNames(arch: OutputArch) {
    switch (arch) {
      case OutputArch.armv7:
        return 'arm'
      case OutputArch.x64:
        return 'x64'
      case OutputArch.x86:
        return 'ia32'
      default:
        throw new Error(`Unsupported npm arch ${arch}`)
    }
  }

  static platformToPkgName(arch: OutputPlatform) {
    switch (arch) {
      case OutputPlatform.linux:
        return 'linux'
      case OutputPlatform.macos:
        return 'macos'
      case OutputPlatform.windows:
        return 'win'
      default:
        throw new Error(`Unsupported pkg platform ${arch}`)
    }
  }
  static platformToNpmName(arch: OutputPlatform) {
    switch (arch) {
      case OutputPlatform.linux:
        return 'linux'
      case OutputPlatform.macos:
        return 'darwin'
      case OutputPlatform.windows:
        return 'win32'
      default:
        throw new Error(`Unsupported npm platform ${arch}`)
    }
  }
}
