export const parameterListMetadataKey = Symbol('parameterListMetadataKey')
export const functionListMetadataKey = Symbol('functionListMetadataKey')

export enum CLIArguments {
  ADD_CONNECTION = 'a',
  CONNECTION = 'c',
  ADD_THREAD = 't',
  RUN = 'r',
  LIST_CONNECTIONS = 'l',
  THREAD_ID = 'i',
  HELP = 'h',
}

export default interface CLIArgumentOptions {
  name: string
  propertyIndex?: number
}
