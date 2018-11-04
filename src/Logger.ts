import ChatPlugContext from './ChatPlugContext'
import Log from './entity/Log'
import Service from './entity/Service'
import chalk from 'chalk'

export enum LogLevel {
  ERROR = 'error',
  INFO = 'info',
  DEBUG = 'debug',
  WARN = 'warn',
  FATAL = 'fatal',
}

type LevelMap = { [x in LogLevel]: string }

const levelBadges: LevelMap = {
  error: chalk.bgRed.white(' ERROR '),
  info: chalk.bgBlue.black(' INFO '),
  warn: chalk.bgYellow.black(' WARN '),
  fatal: chalk.bgWhite.bgRed(' FATAL '),
  debug: chalk.bgCyan.bgGreen(' DEBUG '),
}

const levelArrows: LevelMap = {
  error: chalk.red('›'),
  info: chalk.blue('›'),
  warn: chalk.yellow('›'),
  fatal: chalk.white('›'),
  debug: chalk.cyan('›'),
}

export default class Logger {
  constructor(public context: ChatPlugContext, public service?: Service) {}

  async log(logLevel: LogLevel, msg: string) {
    const scope = this.service ? this.service.moduleName : 'core'
    console.log(
      levelBadges[logLevel],
      chalk.gray(
        new Date()
          .toISOString()
          .replace('T', ' ')
          .substr(0, 19),
      ),
      chalk.reset(scope),
      levelArrows[logLevel],
      chalk.reset(msg),
    )

    const log = new Log()
    log.logLevel = logLevel
    log.systemLog = false
    log.message = msg
    log.service = this.service
    await this.context.connection.getRepository(Log).save(log)
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
