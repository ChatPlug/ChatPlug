import log from 'npmlog'
import { ChatPlug } from './ChatPlug'

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
