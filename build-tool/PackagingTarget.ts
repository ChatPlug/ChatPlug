export default interface PackagingTarget {
  installDependencies(packageContents: any, distDir: string): Promise<void>
  packageApp(distBinPath: string): Promise<void>
}
