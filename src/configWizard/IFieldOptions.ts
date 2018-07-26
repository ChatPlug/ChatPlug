export const fieldOptionsMetadataKey = Symbol('fieldOptionsMetadataKey')
export const fieldListMetadataKey = Symbol('fieldListMetadataKey')

export enum FieldType {
  STRING,
  NUMBER,
  BOOLEAN,
}

export default interface IFieldOptions {
  type: FieldType
  name?: string
  hint?: string
  defaultValue?: any
  required?: boolean
}
