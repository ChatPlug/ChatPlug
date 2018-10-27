import chalk from 'chalk'
export default {
  info(...args) {
    console.log(
      chalk.bgGreen.red('build-tool') +
        chalk.reset(' ') +
        chalk.blue('info') +
        chalk.reset(' '),
      ...args,
    )
  },
  warn(...args) {
    console.log(
      chalk.bgGreen.red('build-tool') +
        chalk.reset(' ') +
        chalk.yellow('warn') +
        chalk.reset(''),
      ...args,
    )
  },
  timed(...args) {
    const start = new Date()
    return () => {
      console.log(
        chalk.bgGreen.red('build-tool') +
          chalk.reset(' ') +
          chalk.green('done') +
          chalk.reset(''),

        ...args,
        chalk.green('in ' + (new Date().getTime() - start.getTime()) + 'ms'),
      )
    }
  },
}
