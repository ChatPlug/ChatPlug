import fs from 'fs'
import log from 'npmlog'
import path from 'path'
import TOML from '@iarna/toml'
import { IChatPlugConnection } from './models'
import Service from './entity/Service'
import ServiceModule from './ServiceModule'
import IFieldOptions, {
  fieldListMetadataKey,
  fieldOptionsMetadataKey,
  FieldType,
} from './configWizard/IFieldOptions'
import ChatPlugContext from './ChatPlugContext'
import { classToPlain } from 'class-transformer'
import nativeRequire from './utils/nativeRequire';

const CONFIG_FOLDER_PATH = path.join(__dirname, '../config')

export class ChatPlugConfig {
  tomlConfig: any
  context: ChatPlugContext
  constructor () {
    // If config folder doesn't exist, create one
    if (!fs.existsSync(CONFIG_FOLDER_PATH)) {
      fs.mkdirSync(CONFIG_FOLDER_PATH)
    }
  }

  readConfigForService (service: Service) {
    return TOML.parse(fs.readFileSync(path.join(CONFIG_FOLDER_PATH, service.moduleName + '.' + service.id + '.toml')))
  }

  configurationExists(service: Service) {
    return fs.existsSync(path.join(CONFIG_FOLDER_PATH, service.moduleName + '.' + service.id + '.toml'))
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
    const config = service.configured ? this.context.config.readConfigForService(service) : null
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
