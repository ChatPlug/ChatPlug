import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'
import fs from 'fs-extra'
import path from 'path'
import { Subject } from 'rxjs'
import ChatPlugContext from './ChatPlugContext'
import Service from './entity/Service'
import { IChatPlugServiceStatus, IChatPlugServiceStatusUpdate } from './models'
import ServiceModule from './ServiceModule'
import { ChatPlugService } from './services/Service'
import nativeRequire from './utils/nativeRequire'

export interface ServiceMap {
  [id: number]: ChatPlugService
}

const servicesPath = path.join(__dirname, 'services')
export class ServiceManager {
  services: ServiceMap
  context: ChatPlugContext
  statusSubject: Subject<IChatPlugServiceStatusUpdate>

  constructor(context: ChatPlugContext) {
    this.context = context
    this.services = {}
    this.statusSubject = new Subject()
  }

  async getAvailableServices() {
    const allFiles = await fs.readdir(servicesPath)
    const services: ServiceModule[] = []
    for (const f of allFiles) {
      const modulePath = path.join(servicesPath, f)
      if ((await fs.stat(modulePath)).isDirectory()) {
        let manifestData: Object | null = null
        try {
          try {
            manifestData = await fs.readJSON(
              path.join(modulePath, 'manifest.json'),
            )
          } catch (e) {
            throw new Error(
              `Failed to read and parse service manifest (${e.message}). Please ensure that the manifest.json file exists and is valid`,
            )
          }
          if (Array.isArray(manifestData)) {
            // array as a plain would freak out class-transformer
            throw new Error('Service manifest cannot be an array.')
          }
          const s = plainToClass(ServiceModule, manifestData)
          const validationErrors = await validate(s)
          if (validationErrors.length > 0) {
            throw new Error(
              `Failed to validate service manifest: ${validationErrors
                .map(e => e.toString())
                .join(', ')}.`,
            )
          }
          s.modulePath = modulePath
          s.moduleName = f
          s.valid = true
          services.push(s)
        } catch (e) {
          const s = new ServiceModule() // create a dummy service module that will only contain the error, bacause we can't access the manifest anyway.
          s.valid = false
          s.error = e.message
          s.modulePath = modulePath
          s.moduleName = f
          s.displayName = f
          services.push(s)
        }
      }
    }
    return services
  }

  getServiceForId(id: number): ChatPlugService | undefined {
    return this.services[id]
  }

  getRegisteredServices(): ChatPlugService[] {
    return Object.keys(this.services).map(k => this.services[k])
  }

  async loadServices() {
    const repo = this.context.connection.getRepository(Service)
    const services = await repo.find({ enabled: true, deleted: false })
    for (const service of services) {
      await this.loadService(service)
    }
  }

  async loadService(service: Service) {
    if (this.context.config.configurationExists(service)) {
      if (this.services[service.id]) {
        return true
      }
      this.services[service.id] = new (nativeRequire(path.join(
        __dirname,
        'services',
        service.moduleName,
      ) as any)).Service(service, this.context)
      await this.context.connection
        .getRepository(Service)
        .update({ id: service.id }, { status: 'shutdown' })
      return true
    }

    await this.context.connection
      .getRepository(Service)
      .update({ id: service.id }, { configured: false })
    return false
  }

  async startupService(service: ChatPlugService) {
    const dbService = await this.context.connection
      .getRepository(Service)
      .findOneOrFail({ id: service.id })
    if (
      dbService.status !== IChatPlugServiceStatus.CRASHED &&
      dbService.status !== IChatPlugServiceStatus.SHUTDOWN
    ) {
      return
    }
    this.context.coreLogger.info(
      `Service instance ${dbService.instanceName} (${
        dbService.moduleName
      }) enabled, initializing...`,
    )
    await this.setServiceStatus(service, IChatPlugServiceStatus.STARTING)
    service
      .initialize()
      .catch(async e => {
        await this.setServiceStatus(service, IChatPlugServiceStatus.CRASHED)
        await service.terminate()
      })
      .then(async () => {
        await this.setServiceStatus(service, IChatPlugServiceStatus.RUNNING)
      })
  }

  async terminateService(service: ChatPlugService) {
    const dbService = await this.context.connection
      .getRepository(Service)
      .findOneOrFail({ id: service.id })
    if (
      dbService.status === IChatPlugServiceStatus.SHUTDOWN ||
      dbService.status === IChatPlugServiceStatus.CRASHED
    ) {
      return
    }
    await this.setServiceStatus(service, IChatPlugServiceStatus.TERMINATING)
    try {
      await service.terminate()
      await this.setServiceStatus(service, IChatPlugServiceStatus.SHUTDOWN)
    } catch (e) {
      await this.setServiceStatus(service, IChatPlugServiceStatus.CRASHED)
    }
  }

  async initiateServices() {
    this.getRegisteredServices().forEach(service => {
      this.startupService(service)
    })
  }

  async reloadServiceForInstance(instance: Service) {
    await this.terminateService(this.services[instance.id])
    delete this.services[instance.id]
    await this.loadService(instance)
    await this.startupService(this.services[instance.id])
  }

  async setServiceStatus(
    service: ChatPlugService,
    status: IChatPlugServiceStatus,
  ) {
    this.statusSubject.next({ serviceId: service.id, statusUpdate: status })
    await this.context.connection
      .getRepository(Service)
      .update({ id: service.id }, { status })
  }

  async terminateServices() {
    return Promise.all(
      this.getRegisteredServices().map(async service => {
        await this.terminateService(service)
      }),
    )
  }
}
