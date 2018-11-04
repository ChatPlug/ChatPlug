import consola from 'consola'
import ChatPlugContext from './ChatPlugContext'
import Log from './entity/Log'
import Service from './entity/Service'

export enum LogLevel {
  ERROR = 'error',
  INFO = 'info',
  DEBUG = 'debug',
  WARN = 'warn',
  FATAL = 'fatal',
}

export default class Logger {
  constructor(public context: ChatPlugContext, public service?: Service) {}

  async log(logLevel: LogLevel, msg: string) {
    const log = new Log()
    log.logLevel = logLevel
    log.systemLog = false
    log.message = msg
    log.service = this.service
    this.context.connection.getRepository(Log).save(log)
    consola[logLevel]({
      message: msg,
      badge: true,
      scope: this.service ? this.service.moduleName : 'core',
    })
  }

  error(msg: string) {
    return this.log(LogLevel.ERROR, msg)
  }
  info(msg: string) {
    return this.log(LogLevel.INFO, msg)
  }
  fatal(msg: string) {
    return this.log(LogLevel.FATAL, msg)
  }
  warn(msg: string) {
    return this.log(LogLevel.WARN, msg)
  }
  debug(msg: string) {
    return this.log(LogLevel.DEBUG, msg)
  }
}
