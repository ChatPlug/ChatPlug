import readline from 'readline'
import IFieldOptions, { FieldType } from '../IFieldOptions'
import chalk from 'chalk'

export default class CLIUtils {
  private printPrompt(opts: IFieldOptions) {
    if (opts.hint) {
      console.log('')
      console.log(chalk.magenta(opts.hint))
    }
    process.stdout.write(chalk.blueBright(opts.name as string))
    if (opts.required) {
      process.stdout.write(chalk.gray(' [') + chalk.red('*') + chalk.gray(']'))
    } else if (opts.defaultValue !== null) {
      process.stdout.write(
        chalk.gray(' [') + chalk.dim('' + opts.defaultValue) + chalk.gray(']'),
      )
    }
    if (opts.type === FieldType.BOOLEAN) {
      process.stdout.write(
        chalk.gray(' (') +
          chalk.underline.bold('t') +
          'rue' +
          chalk.gray('/') +
          chalk.underline.bold('f') +
          'alse' +
          chalk.gray(')'),
      )
    }
    process.stdout.write(chalk.gray(': '))
  }
  private convertValue(opts: IFieldOptions, val: string): any {
    if (val === '' && opts.required) {
      throw new Error(`"${opts.name}" is required.`)
    }
    if (val === '' && opts.defaultValue != null) {
      return opts.defaultValue
    }
    if (opts.type === FieldType.BOOLEAN) {
      const boolMap = {
        y: true,
        t: true,
        true: true,
        yes: true,
        f: false,
        n: false,
        false: false,
        no: false,
      }
      const normalizedVal = val.trim().toLowerCase()
      if (normalizedVal === '' || boolMap[normalizedVal] == null) {
        throw new Error(
          `"${opts.name}" should be a boolean (${Object.keys(boolMap).join(
            ', ',
          )}).`,
        )
      }
      return boolMap[normalizedVal]
    }
    return val
  }
  readLine() {
    const rl = readline.createInterface({
      input: process.stdin,
      // output: process.stdout,
    })
    return new Promise<string>(res =>
      rl.on('line', answer => {
        res(answer)
        rl.close()
      }),
    )
  }
  async askUser(opts: IFieldOptions) {
    while (true) {
      this.printPrompt(opts)
      const val = await this.readLine()
      try {
        return this.convertValue(opts, val)
      } catch (e) {
        console.log(chalk.red(e.message))
      }
    }
  }
}
