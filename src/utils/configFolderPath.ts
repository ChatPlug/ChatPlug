import path from 'path'
let configFolderPath: string
if ((process as any).pkg && (process as any).pkg.entrypoint) {
  // packaged build
  configFolderPath = path.resolve(path.dirname(process.execPath), '../config')
} else {
  configFolderPath = path.resolve(__dirname, '../config')
}
export default configFolderPath
