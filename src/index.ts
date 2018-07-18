import 'reflect-metadata'
import log from 'npmlog'
import { ChatPlug } from './ChatPlug'
import CLIConfigWizard from './configWizard/CLIConfigWizard'
import { Config } from './services/facebook'
import ChatPlugConfigSkeleton from './ChatPlugConfigSkeleton'

// TODO: move to a better place
const wizard = new CLIConfigWizard()
wizard.promptForConfig(Config).then(v => {
  console.log(v)

  const chatplug = new ChatPlug()
  chatplug
    .startBridge()
    .then()
    .catch()

  process.on('SIGINT', () => {
    log.info('', 'Logging out...')
    chatplug
      .stopBridge()
      .then(() => process.exit(log.info('', 'Logged out') || 0))
      .catch(err => process.exit(log.error('', err) || 1))
  })
})
