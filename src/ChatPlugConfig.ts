import TOML from '@iarna/toml'
import { classToPlain } from 'class-transformer'
import fs from 'fs'
import path from 'path'
import ChatPlugContext from './ChatPlugContext'
import IFieldOptions, {
  fieldListMetadataKey,
  fieldOptionsMetadataKey,
  FieldType,
} from './configWizard/IFieldOptions'
import Service from './entity/Service'
import configFolderPath from './utils/configFolderPath'
import nativeRequire from './utils/nativeRequire'

export class ChatPlugConfig {
  tomlConfig: any
  context: ChatPlugContext
  constructor() {
    // If config folder doesn't exist, create one
    if (!fs.existsSync(configFolderPath)) {
      fs.mkdirSync(configFolderPath)
    }
  }

  readConfigForService(service: Service) {
    return TOML.parse(fs.readFileSync(
      path.join(
        configFolderPath,
        `${service.moduleName}.${service.id}.toml`,
      ),
      'utf8',
    ) as string)
  }

  configurationExists(service: Service) {
    return fs.existsSync(
      path.join(
        configFolderPath,
        `${service.moduleName}.${service.id}.toml`,
      ),
    )
  }

  async getConfigurationWithSchema(service: Service) {
    const serviceModule = (await this.context.serviceManager.getAvailableServices()).find(
      el => el.moduleName === service.moduleName,
    )

    if (!serviceModule) {
      return
    }

    const schema = nativeRequire(serviceModule.modulePath).Config
    const cfg = new schema()
    const fieldList = Reflect.getMetadata(fieldListMetadataKey, cfg) as string[]
    const config = service.configured
      ? this.context.config.readConfigForService(service)
      : null
    return fieldList.map(key => {
      const options = classToPlain(Reflect.getMetadata(
        fieldOptionsMetadataKey,
        cfg,
        key,
      ) as IFieldOptions)
      // @ts-ignore
      options.type = FieldType[options.type]
      if (options['required'] === undefined) {
        options['required'] = true
      }
      if (config) {
        options['value'] = config[options['name']]
      }
      return options
    })
  }
}
