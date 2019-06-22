import 'reflect-metadata'
import { ChatPlug } from './ChatPlug'
import ChatPlugContext from './ChatPlugContext'
import { getAliasMap } from './configWizard/cli/CLIArguments'
import CLICommands from './configWizard/cli/CLICommands'
// These files are not used by chatplug directly, but by services. We have to import them here so they are included in chatplug.lib.js.
import './services/MessageHandler'
import './services/Service'
import './services/ServiceCapabilities'
import 'tslib'

export default async function () {
  const argv = require('yargs-parser')(process.argv.slice(2), {
    alias: getAliasMap(),
  })

  const context = new ChatPlugContext()
  context.initializeConnection().then(async () => {
    const chatplug = new ChatPlug(context)
    const cli = new CLICommands(context, chatplug)
    await cli.handleArgv(argv)
  })
}
