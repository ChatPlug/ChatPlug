import 'reflect-metadata'
import { ChatPlug } from './ChatPlug'
import ChatPlugContext from './ChatPlugContext'
import { getAliasMap } from './configWizard/cli/CLIArguments'
import CLICommands from './configWizard/cli/CLICommands'
import fs from 'fs-extra'
// These files are not used by chatplug directly, but by services. We have to import them here so they are included in chatplug.lib.js.
import './services/MessageHandler'
import './services/Service'
import './services/ServiceCapabilities'
import 'tslib'

export default async function() {
  // function walk(dir: string, lvl: number = 0) {
  //   var list = fs.readdirSync(dir)
  //   list.forEach(function(file) {
  //     file = dir + '/' + file
  //     console.log(
  //       Array(lvl)
  //         .fill(' ')
  //         .join('') + file,
  //     )
  //     var stat = fs.statSync(file)
  //     if (stat && stat.isDirectory()) {
  //       /* Recurse into a subdirectory */
  //       walk(file, lvl + 2)
  //     }
  //   })
  // }
  // walk(__dirname)
  const argv = require('yargs-parser')(process.argv.slice(2), {
    alias: getAliasMap(),
  })

  const context = new ChatPlugContext()
  context.initializeConnection().then(async () => {
    const chatplug = new ChatPlug(context)
    const cli = new CLICommands(context, chatplug)
    cli.handleArgv(argv)
  })
}
