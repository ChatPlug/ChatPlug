export const parameterListMetadataKey = Symbol('parameterListMetadataKey')
export const functionListMetadataKey = Symbol('functionListMetadataKey')
export const helpMessageMetadataKey = Symbol('helpMessageMetadataKey')

export const cliAlias = {
  c: 'connection',
  s: 'service',
  o: 'run',
  t: 'thread',
  h: 'help',
  r: 'remove',
  a: 'add',
  e: 'enable',
  d: 'disable',
  k: 'configure',
}

class CLIParameter {
  parameter: string
  description: string | null

  constructor(parameter: string, description: string | null = null) {
    this.parameter = parameter
    this.description = description
  }
}

export enum CLIArguments {
  ADD = 'a',
  REMOVE = 'r',
  DISABLE = 'd',
  ENABLE = 'e',
  CONFIGURE = 'k',

  CONNECTION = 'c',
  THREAD = 't',
  SERVICE = 's',

  RUN = 'o',
  HELP = 'h',
}

export enum DescriptionFlags {
  IGNORE = '!ignore',
}

export const cliParameters = {
  a: new CLIParameter('add'),
  r: new CLIParameter('remove'),
  d: new CLIParameter('disable'),
  e: new CLIParameter('enable'),
  k: new CLIParameter('configure'),

  c: new CLIParameter('connection', 'thread connection name or :id'),
  t: new CLIParameter('thread', 'external thread id'),
  s: new CLIParameter('service', 'service name'),

  o: new CLIParameter('run'),
  h: new CLIParameter('help'),
}

export const getAliasMap = () => {
  const aliasMap = {}
  for (const alias of Object.keys(cliParameters)) {
    aliasMap[alias] = cliParameters[alias].parameter
  }

  return aliasMap
}

export default interface CLIArgumentOptions {
  name: string
  propertyIndex?: number
  descriptionOverride?: string
}
