import IFieldOptions, {
  fieldOptionsMetadataKey,
  fieldListMetadataKey,
} from './IFieldOptions'

export default (options: IFieldOptions) => {
  return (target: Object, propertyKey: string) => {
    if (!Reflect.hasMetadata(fieldListMetadataKey, target)) {
      Reflect.defineMetadata(fieldListMetadataKey, [], target)
    }
    const fieldList = Reflect.getMetadata(
      fieldListMetadataKey,
      target,
    ) as string[]
    fieldList.push(propertyKey)
    Reflect.defineMetadata(
      fieldOptionsMetadataKey,
      options,
      target,
      propertyKey,
    )
  }
}
