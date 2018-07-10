import log from 'npmlog'
import IConfigWizard from './IConfigWizard'
import IFieldOptions, {
  fieldListMetadataKey,
  fieldOptionsMetadataKey,
  FieldType,
} from './IFieldOptions'
import CLIUtils from './CLIUtils'

export default class CLIConfigWizard implements IConfigWizard {
  cliUtils = new CLIUtils()
  async promptForConfig<T>(configType: new () => T): Promise<T> {
    const cfg = new configType()
    if (!Reflect.hasMetadata(fieldListMetadataKey, cfg)) {
      log.warn(
        'config-wizard',
        `Config object ${configType.name} has no fields for the config wizard.`,
      )
      return cfg
    }
    const fieldList = Reflect.getMetadata(fieldListMetadataKey, cfg) as string[]
    for (const key of fieldList) {
      const options = Reflect.getMetadata(
        fieldOptionsMetadataKey,
        cfg,
        key,
      ) as IFieldOptions
      let val = await this.cliUtils.askUser(
        options.name || key,
        options.defaultValue,
      )
      if (val === '') {
        val = options.defaultValue
      }
      cfg[key] = val
    }
    return cfg
  }
}
