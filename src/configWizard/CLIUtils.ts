import readline from 'readline'

export default class CLIUtils {
  askUser(question: string, defaultValue: string) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    let formattedDefaultValue = ''
    if (defaultValue) {
      formattedDefaultValue = `[${defaultValue}]`
    }
    return new Promise<string>(res =>
      rl.question(question + formattedDefaultValue + ': ', answer => {
        res(answer)
        rl.close()
      }),
    )
  }
}
