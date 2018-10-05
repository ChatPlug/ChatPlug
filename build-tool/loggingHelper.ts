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
  timed(...args) {
    const start = new Date()
    return () => {
      console.log(
        chalk.bgGreen.red('build-tool') +
          chalk.reset(' ') +
          chalk.blue('done') +
          chalk.reset(' ') +
          chalk.green(new Date().getTime() - start.getTime() + 'ms') +
          chalk.reset(' '),
        ...args,
      )
    }
  },
}
