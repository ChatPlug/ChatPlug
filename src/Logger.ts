import ChatPlugContext from './ChatPlugContext'
import Service from './entity/Service'

export enum LogLevel {
  ERROR,
  INFO,
  DEBUG,
  WARN,
}

class Logger {
  context: ChatPlugContext
  constructor (context: ChatPlugContext) {
    this.context = context
  }

  log(service, loglevel: LogLevel, msg: String) {
    service: Service
    console.log(msg)
  }
}

export default Logger
