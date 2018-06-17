import log from 'npmlog'
import { Facegram } from './Facegram'

const facegram = new Facegram()
facegram
  .startBridge()
  .then()
  .catch()

process.on('SIGINT', () => {
  log.info('', 'Logging out...')
  facegram
    .stopBridge()
    .then(() => process.exit(log.info('', 'Logged out') || 0))
    .catch(err => process.exit(log.error('', err) || 1))
})
