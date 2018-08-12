import 'reflect-metadata'
import log from 'npmlog'
import { ChatPlug } from './ChatPlug'
import ChatPlugContext from './ChatPlugContext'
import ThreadConnection from './entity/ThreadConnection'
import Thread from './entity/Thread'
import Service from './entity/Service'
import chalk from 'chalk'
import CLICommands from './configWizard/cli/CLICommands'
import { getAliasMap } from './configWizard/cli/CLIArguments'

const argv = require('yargs-parser')(process.argv.slice(2), {
  alias: getAliasMap(),
})

const context = new ChatPlugContext()
context.initializeConnection().then(async () => {
  const chatplug = new ChatPlug(context)
  const cli = new CLICommands(context, chatplug)
  cli.handleArgv(argv)
})
