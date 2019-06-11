import { exec } from 'child_process'
import path from 'path'
import fs from 'fs-extra'

export default async function runCommand(command: string, cwd?: string) {
  await new Promise((res, rej) => {
    const nuxtProc = exec(command, {
      cwd,
    })
    nuxtProc!.stdout!.pipe(process.stdout)
    nuxtProc!.stderr!.pipe(process.stderr)
    nuxtProc.on('exit', code => {
      if (code === 0) {
        res()
      } else {
        rej(new Error(`Running '${command}' failed with error code ${code}`))
      }
    })
  })
}
