import ChatPlugContext from './ChatPlugContext'
import Service from './entity/Service'
import Log from './entity/Log'
import consola from 'consola'

export enum LogLevel {
  ERROR = 'error',
  INFO = 'info',
  DEBUG = 'debug',
  WARN = 'warn',
  FATAL = 'fatal',
}

class Logger {
  context: ChatPlugContext
  constructor (context: ChatPlugContext) {
    this.context = context
  }

  log(service: Service, logLevel: LogLevel, msg: string) {
    const log = new Log()
    log.logLevel = logLevel
    log.systemLog = false
    log.message = msg
    log.service = service
    this.context.connection.getRepository(Log).save(log)
    consola[logLevel]({ message: msg, badge: true, scope: service.moduleName })
  }
}

export default Logger
