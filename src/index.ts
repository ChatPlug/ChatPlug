import 'reflect-metadata';
import { ChatPlug } from './ChatPlug';
import ChatPlugContext from './ChatPlugContext';
import { getAliasMap } from './configWizard/cli/CLIArguments';
import CLICommands from './configWizard/cli/CLICommands';

const argv = require('yargs-parser')(process.argv.slice(2), {
  alias: getAliasMap(),
})

const context = new ChatPlugContext()
context.initializeConnection().then(async () => {
  const chatplug = new ChatPlug(context)
  const cli = new CLICommands(context, chatplug)
  cli.handleArgv(argv)
})
