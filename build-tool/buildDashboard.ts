import path from 'path'
import fs from 'fs-extra'
import runCommand from './runCommand'

export default async function () {
  await runCommand(
    `${path.resolve(
      __dirname,
      '../src/services/dashboard/web/node_modules/.bin/nuxt',
    )} generate`,
    path.resolve(__dirname, '../src/services/dashboard/web'),
  )
  await fs.copy(
    path.resolve(__dirname, '../src/services/dashboard/web/dist'),
    path.resolve(__dirname, '../dist/dashboard-web'),
  )
}
