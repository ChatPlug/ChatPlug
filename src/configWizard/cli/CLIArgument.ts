import CLIArgumentOptions, {
  functionListMetadataKey,
  parameterListMetadataKey,
} from './CLIArguments'

export default (options: CLIArgumentOptions) => {
  return (target: Object, propertyKey: string, parameterIndex: number) => {
    options.propertyIndex = parameterIndex

    if (!Reflect.hasMetadata(functionListMetadataKey, target)) {
      Reflect.defineMetadata(
        functionListMetadataKey,
        [],
        target)
    }

    const functionList = Reflect.getMetadata(functionListMetadataKey, target) as string[]
    if (!functionList.includes(propertyKey)) {
      functionList.push(propertyKey)
    }

    if (!Reflect.hasMetadata(parameterListMetadataKey, target, propertyKey)) {
      Reflect.defineMetadata(
        parameterListMetadataKey,
        [],
        target,
        propertyKey)
    }
    const fieldList = Reflect.getMetadata(
      parameterListMetadataKey,
      target,
      propertyKey,
    ) as CLIArgumentOptions[]
    fieldList.push(options)
  }
}
