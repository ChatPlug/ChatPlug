import { CLIArguments } from './CLIArguments'
import chalk from 'chalk'

const createCLIHelpMessage = (command: string, argument: CLIArguments, helpMessage: string, valueHelp: string | null = null) : string => {
  let fvalueHelp = ''
  if (valueHelp) {
    fvalueHelp = chalk.blueBright(' <' + valueHelp + '>')
  }
  return chalk.blue(' -' + argument + ', '  + '--' + command) + fvalueHelp + ' ' + chalk.greenBright(helpMessage)
}

const registeredCommands = [
  createCLIHelpMessage('addConnection', CLIArguments.ADD_CONNECTION, 'Creates new thread connection.', 'connection name'),
  createCLIHelpMessage('connection', CLIArguments.CONNECTION, 'Selects thread connection', 'connection name'),
  createCLIHelpMessage('run', CLIArguments.RUN, 'Starts ChatPlug'),
  createCLIHelpMessage('listConnections', CLIArguments.LIST_CONNECTIONS, 'Outputs all thread connections'),
  createCLIHelpMessage('addThread', CLIArguments.ADD_THREAD, 'Adds new thread to connection from given service', 'service name'),
  createCLIHelpMessage('id', CLIArguments.THREAD_ID, 'Specifies thread\'s id', 'Thread id from given service'),
  createCLIHelpMessage('help', CLIArguments.HELP, 'Prints this message'),
]

const logo = (`ChatPlug`)

const printHelpMessage = () => {
  console.log(chalk.blueBright(logo))
  for (const msg of registeredCommands) {
    console.log(msg)
  }
}

export default printHelpMessage
