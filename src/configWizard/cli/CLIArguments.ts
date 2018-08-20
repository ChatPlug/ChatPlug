export const parameterListMetadataKey = Symbol('parameterListMetadataKey')
export const functionListMetadataKey = Symbol('functionListMetadataKey')

export enum CLIArguments {
  ADD_CONNECTION = 'a',
  CONNECTION = 'c',
  ADD_THREAD = 't',
  START = 's',
  LIST_CONNECTIONS = 'l',
  THREAD_ID = 'i',
  HELP = 'h',
  REMOVE_THREAD = 'r',
}

export default interface CLIArgumentOptions {
  name: string
  propertyIndex?: number
}
