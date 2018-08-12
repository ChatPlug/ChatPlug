import CLIArgumentOptions, {
  helpMessageMetadataKey,
} from './CLIArguments'

export default (message: string) => {
  return (target: Object, propertyKey: string) => {
    Reflect.defineMetadata(
      helpMessageMetadataKey,
      message,
      target,
      propertyKey,
    )
  }
}
