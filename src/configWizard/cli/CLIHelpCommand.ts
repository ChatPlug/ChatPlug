import CLICommands from './CLICommands'
import CLIArgumentOptions, {
  CLIArguments,
  cliParameters,
  parameterListMetadataKey,
  helpMessageMetadataKey,
  functionListMetadataKey,
  DescriptionFlags } from './CLIArguments'
import chalk from 'chalk'

export const printHelpMessage = (instance: CLICommands) => {
  const functions = Reflect.getMetadata(functionListMetadataKey, instance)
  for (const key of functions) {
    const parameters = Reflect.getMetadata(
      parameterListMetadataKey,
      instance,
      key,
    ) as CLIArgumentOptions[]
    const helpMessage = Reflect.getMetadata(
      helpMessageMetadataKey,
      instance,
      key,
    ) as string

    console.log('')
    console.log(chalk.green(helpMessage))
    const sortedParameters = parameters.sort((a, b) => { return a.propertyIndex!! - b.propertyIndex!! })
    for (const [index, param] of sortedParameters.entries()) {
      const alias = param.name
      let description = cliParameters[alias].description || ''

      for (const _ of [...Array(index + 1)]) {
        process.stdout.write('  ')
      }
      if (param.descriptionOverride) {
        description = param.descriptionOverride
      }

      if (param.descriptionOverride === DescriptionFlags.IGNORE) {
        description = ''
      }

      if (description) {
        description = chalk.blue(`<${description}> `)
      }
      console.log(`--${chalk.gray(cliParameters[alias].parameter)} (-${chalk.blueBright(alias)}) ${description}`)
    }
  }
}
