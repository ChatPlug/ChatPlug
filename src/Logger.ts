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

class Logger {
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

export default Logger

class XDDD {
  abc: string
  func() {
    return 'XDD'
  }
  funcb(a: number, b: string) {}
  async funcd(arg: number) {
    return 2
  }
}

export type Mapper<U extends Unmapped> = {
  mapped: Mapped<U>
}

export type Unmapped = {
  [name: string]: (...args: any[]) => any
}

type IsValidArg<T> = T extends object
  ? keyof T extends never ? false : true
  : true

type Promisified<T extends Function> = T extends (
  ...args: any[]
) => Promise<any>
  ? T
  : (T extends (
      a: infer A,
      b: infer B,
      c: infer C,
      d: infer D,
      e: infer E,
      f: infer F,
      g: infer G,
      h: infer H,
      i: infer I,
      j: infer J,
    ) => infer R
      ? (IsValidArg<J> extends true
          ? (
              a: A,
              b: B,
              c: C,
              d: D,
              e: E,
              f: F,
              g: G,
              h: H,
              i: I,
              j: J,
            ) => Promise<R>
          : IsValidArg<I> extends true
            ? (
                a: A,
                b: B,
                c: C,
                d: D,
                e: E,
                f: F,
                g: G,
                h: H,
                i: I,
              ) => Promise<R>
            : IsValidArg<H> extends true
              ? (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H) => Promise<R>
              : IsValidArg<G> extends true
                ? (a: A, b: B, c: C, d: D, e: E, f: F, g: G) => Promise<R>
                : IsValidArg<F> extends true
                  ? (a: A, b: B, c: C, d: D, e: E, f: F) => Promise<R>
                  : IsValidArg<E> extends true
                    ? (a: A, b: B, c: C, d: D, e: E) => Promise<R>
                    : IsValidArg<D> extends true
                      ? (a: A, b: B, c: C, d: D) => Promise<R>
                      : IsValidArg<C> extends true
                        ? (a: A, b: B, c: C) => Promise<R>
                        : IsValidArg<B> extends true
                          ? (a: A, b: B) => Promise<R>
                          : IsValidArg<A> extends true
                            ? (a: A) => Promise<R>
                            : () => Promise<R>)
      : never)

export type Mapped<U extends Unmapped> = { [N in keyof U]: Promisified<U[N]> }

type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never
}[keyof T]
type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>

type BetterXDD = Mapped<FunctionProperties<XDDD>>
