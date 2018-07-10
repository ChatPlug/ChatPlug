import readline from 'readline'

export default class CLIUtils {
  askUser(question: string) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    return new Promise<string>(res =>
      rl.question(question, answer => {
        res(answer)
        rl.close()
      }),
    )
  }
}
