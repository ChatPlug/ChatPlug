import TOML from '@iarna/toml'
import { classToPlain } from 'class-transformer'
import path from 'path'
import {
  BadRequestError,
  BodyParam,
  Get,
  Delete,
  Put,
  Body,
  InternalServerError,
  JsonController,
  NotFoundError,
  Param,
  Post,
} from 'routing-controllers'
import { Repository } from 'typeorm'
import ChatPlugContext from '../../../ChatPlugContext'
import IFieldOptions, {
  fieldListMetadataKey,
  fieldOptionsMetadataKey,
  FieldType,
} from '../../../configWizard/IFieldOptions'
import Service from '../../../entity/Service'
import fs from 'fs-extra'
import User from '../../../entity/User'
import ServiceInstance from '../../dashboard/web/types/ServiceInstance'
import { IChatPlugServiceStatus } from '../../../models'

const CONFIG_FOLDER_PATH = path.join(__dirname, '../../../../config')
@JsonController('/services')
export default class ServicesController {
  servicesRepository: Repository<Service>
  context: ChatPlugContext
  constructor(context: ChatPlugContext) {
    this.context = context
    this.servicesRepository = context.connection.getRepository(Service)
  }

  @Get('/instances')
  async getServiceInstances() {
    const instances = await this.servicesRepository.find()
    const serviceModules = await this.context.serviceManager.getAvailableServices()
    return instances.map(ins => ({
      ...classToPlain(ins),
      serviceModule: serviceModules.find(
        sm => sm.moduleName === ins.moduleName,
      ),
    }))
  }

  @Post('/instances')
  async createNewInstance(
    @BodyParam('moduleName', { required: true }) serviceModuleName: string,
    @BodyParam('instanceName', { required: true }) serviceInstanceName: string,
    @BodyParam('config', { required: true, parse: true }) configuration: any,
  ) {
    const serviceModule = (await this.context.serviceManager.getAvailableServices()).find(
      el => el.moduleName === serviceModuleName,
    )
    if (!serviceModule) {
      throw new NotFoundError()
    }

    const schema = require(serviceModule.modulePath).Config
    const fieldList = Reflect.getMetadata(
      fieldListMetadataKey,
      new schema(),
    ) as string[]
    if (!fieldList.every(el => configuration[el] !== undefined)) {
      throw new BadRequestError('Config does not match schema')
    }

    if (!serviceModule) {
      throw new NotFoundError('Service with given name does not exist')
    }

    const service = new Service()
    service.configured = true
    service.enabled = true
    service.instanceName = serviceInstanceName
    service.moduleName = serviceModule.moduleName

    await this.servicesRepository.save(service)

    fs.writeFileSync(
      path.join(
        CONFIG_FOLDER_PATH,
        service.moduleName + '.' + service.id + '.toml',
      ),
      TOML.stringify(configuration),
    )

    return service
  }

  @Post('/instances/draft')
  async createNewInstanceDraft(
    @BodyParam('moduleName', { required: true }) serviceModuleName: string,
  ) {
    const serviceModule = (await this.context.serviceManager.getAvailableServices()).find(
      el => el.moduleName === serviceModuleName,
    )
    if (!serviceModule) {
      throw new NotFoundError()
    }

    const service = new Service()
    service.configured = false
    service.enabled = true
    service.instanceName = 'Instance name'
    service.moduleName = serviceModule.moduleName

    await this.servicesRepository.save(service)
    return service
  }

  @Get('/')
  async getAvailableServices() {
    return await this.context.serviceManager.getAvailableServices()
  }

  @Get('/instances/:id/disable')
  async disableService() {}

  @Get('/instances/:id/users')
  async getServiceUsers(@Param('id') id: number) {
    return await this.context.connection.getRepository(User).find({ where: { service: { id } } })
  }

  @Delete('/instances/:id')
  async deleteService(@Param('id') id: number) {
    const foundService = await this.servicesRepository.findOne({ id })

    return this.servicesRepository.remove(foundService!!)
  }

  @Put('/instances/:id')
  async updateService(
    @Param('id') id: number,
    @Body() instance: ServiceInstance) {
    return this.servicesRepository.update({ id }, instance)
  }

  @Get('/:module/schema')
  async getConfigSchema(@Param('module') moduleName: string) {
    const serviceModule = (await this.context.serviceManager.getAvailableServices()).find(
      el => el.moduleName === moduleName,
    )
    if (!serviceModule) {
      throw new NotFoundError()
    }

    const schema = require(serviceModule.modulePath).Config
    const cfg = new schema()
    const fieldList = Reflect.getMetadata(fieldListMetadataKey, cfg) as string[]

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
      return options
    })
  }

  @Get('/instances/:id/schema')
  async getConfigurationWithSchema(@Param('id') id: number) {
    const service = await this.servicesRepository.findOneOrFail({ id })

    const serviceModule = (await this.context.serviceManager.getAvailableServices()).find(
      el => el.moduleName === service.moduleName,
    )

    if (!serviceModule) {
      throw new NotFoundError()
    }

    const schema = require(serviceModule.modulePath).Config
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

  @Get('/instances/:id/status/startup')
  async startService(@Param('id') id : number) {
    const service = await this.servicesRepository.findOneOrFail({ id })
    this.context.serviceManager.startupService(this.context.serviceManager.getServiceForId(service.id))
    return this.servicesRepository.findOneOrFail({ id })
  }

  @Get('/instances/:id/status/terminate')
  async terminateService(@Param('id') id : number) {
    const service = await this.servicesRepository.findOneOrFail({ id })
    this.context.serviceManager.terminateService(this.context.serviceManager.getServiceForId(service.id))
    return this.servicesRepository.findOneOrFail({ id })
  }

  @Get('/instances/:id/status/restart')
  async restartService(@Param('id') id : number) {
    const service = await this.servicesRepository.findOneOrFail({ id })
    this.context.serviceManager.reloadServiceForInstance(service)
    return this.servicesRepository.findOneOrFail({ id })
  }

  @Post('/instances/:id/configure')
  async configureInstance(
    @Param('id') id: number,
    @BodyParam('config', { required: true, parse: true }) configuration: any,
  ) {
    const service = await this.servicesRepository.findOneOrFail({ id })
    const serviceModule = (await this.context.serviceManager.getAvailableServices()).find(
      el => el.moduleName === service.moduleName,
    )
    if (!serviceModule) {
      throw new NotFoundError()
    }

    const schema = require(serviceModule.modulePath).Config
    const fieldList = Reflect.getMetadata(
      fieldListMetadataKey,
      new schema(),
    ) as string[]
    if (!fieldList.every(el => configuration[el] !== undefined)) {
      throw new BadRequestError('Config does not match schema')
    }

    fs.writeFileSync(
      path.join(
        CONFIG_FOLDER_PATH,
        service.moduleName + '.' + service.id + '.toml',
      ),
      TOML.stringify(configuration),
    )

    if (!serviceModule) {
      throw new NotFoundError('Service with given name does not exist')
    }

    service.configured = true

    await this.servicesRepository.save(service)
    return service
  }

  @Get('/instances/:id/enable')
  async enableService() {}
}
