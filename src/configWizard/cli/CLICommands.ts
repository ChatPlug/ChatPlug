import ChatPlugContext from '../../ChatPlugContext'
import CLIArgumentOptions, {
  CLIArguments,
  parameterListMetadataKey,
  helpMessageMetadataKey,
  DescriptionFlags,
  functionListMetadataKey } from './CLIArguments'
import { printHelpMessage } from './CLIHelpCommand'
import CLIArgument from './CLIArgument'
import log from 'npmlog'
import { Connection } from 'typeorm'
import ThreadConnection from '../../entity/ThreadConnection'
import Thread from '../../entity/Thread'
import Service from '../../entity/Service'
import chalk from 'chalk'
import { ChatPlug } from '../../ChatPlug'
import HelpMessage from './HelpMessage'
import fs = require('fs')
import CLIConfigWizard from './CLIConfigWizard'
import path from 'path'
import TOML from '@iarna/toml'

const CONFIG_FOLDER_PATH = path.join(__dirname, '../../../config')

export default class CLICommands {
  context: ChatPlugContext
  connection: Connection
  chatplug: ChatPlug

  constructor(context: ChatPlugContext, chatplug: ChatPlug) {
    this.context = context
    this.connection = context.connection
    this.chatplug = chatplug
  }

  public async handleArgv(argv: any) {
    const functions = Reflect.getMetadata(functionListMetadataKey, this)
    for (const key of functions) {
      const parameters = Reflect.getMetadata(
        parameterListMetadataKey,
        this,
        key,
      ) as CLIArgumentOptions[]
      const helpMessage = Reflect.getMetadata(
        helpMessageMetadataKey,
        this,
        key,
      ) as string

      const sortedParameters = parameters.sort((a, b) => { return a.propertyIndex!! - b.propertyIndex!! })
      if (sortedParameters.every((item) => argv[item.name] !== undefined) && ((Object.keys(argv).length - 1) / 2) === sortedParameters.length) {
        await this[key].apply(this, sortedParameters.map((item) => { return argv[item.name] }))
        return
      }
    }

    log.error('core', 'Invalid command. Use --help to see available commands for ChatPlug.')
  }

  @HelpMessage('Starts ChatPlug')
  public async start(@CLIArgument({ name: CLIArguments.RUN }) _: boolean) {
    this.chatplug
      .startBridge()
      .then()
      .catch()

    process.on('SIGINT', () => {
      log.info('', 'Logging out...')
      this.chatplug
        .stopBridge()
        .then(() => process.exit(log.info('', 'Logged out') || 0))
        .catch(err => process.exit(log.error('', err) || 1))
    })
  }

  @HelpMessage('Shows this message')
  public async help(@CLIArgument({ name: CLIArguments.HELP }) _: boolean) {
    printHelpMessage(this)
  }

  @HelpMessage('Creates new connection with given name')
  public async addConnection(@CLIArgument({ name: CLIArguments.CONNECTION, descriptionOverride: 'connection name' }) connectionName: string, @CLIArgument({ name: CLIArguments.ADD }) _: boolean) {
    const repository = this.connection.getRepository(ThreadConnection)
    const connection = new ThreadConnection()
    connection.connectionName = connectionName
    connection.threads = []
    const result = await repository.save(connection)
    log.info('core', 'Added connection ' + result.connectionName)
  }

  @HelpMessage('Removes thread from given connection with specified service instance')
  public async removeThread(
    @CLIArgument({ name: CLIArguments.CONNECTION }) connName: string,
    @CLIArgument({ name: CLIArguments.SERVICE }) serviceName: string,
    @CLIArgument({ name: CLIArguments.INSTANCE }) instance: string,
    @CLIArgument({ name: CLIArguments.THREAD }) threadId: string,
    @CLIArgument({ name: CLIArguments.REMOVE }) _: boolean) {
    const serviceRepository = this.connection.getRepository(Service)
    const threadRepository = this.connection.getRepository(Thread)

    const connectionRepository = this.connection.getRepository(ThreadConnection)
    const connection = await connectionRepository.findOne({ connectionName: connName })
    const foundService = await serviceRepository.findOne({ where: { moduleName: serviceName, instanceName: instance }, relations: ['threads'] })

    const thread = await threadRepository.findOne({ externalServiceId: threadId, service: foundService, threadConnection: connection })

    if (!thread) {
      log.error('core', 'Cannot find thread with specified parameters.')
      return
    }

    threadRepository.remove(thread)
    log.info('core', 'Removed thread #' + threadId + ' from connection ' + connName)
  }

  @HelpMessage('Creates new thread in given connection with provided service instance')
  public async addThread(
    @CLIArgument({ name: CLIArguments.CONNECTION }) connName: string,
    @CLIArgument({ name: CLIArguments.SERVICE }) serviceName: string,
    @CLIArgument({ name: CLIArguments.INSTANCE }) instance: string,
    @CLIArgument({ name: CLIArguments.THREAD }) threadId: string,
    @CLIArgument({ name: CLIArguments.ADD }) _: boolean) {
    const serviceRepository = this.connection.getRepository(Service)
    const connectionRepository = this.connection.getRepository(ThreadConnection)
    const connection = await connectionRepository.findOne({ connectionName: connName })
    const service = await serviceRepository.findOne({ where: { moduleName: serviceName, instanceName: instance }, relations: ['threads'] })

    if (!service) {
      log.error('core', 'Cannot find service with given name.')
      return
    }

    if (!connection) {
      log.error('core', 'Cannot find connection with given name')
      return
    }

    if (connection.threads.some((el) => { return el.externalServiceId === threadId })) {
      log.error('core', 'Thread with given id already exists in this connection')
      return
    }

    const thread = new Thread()
    thread.externalServiceId = threadId
    thread.service = service
    thread.threadConnection = connection
    connection.threads.push(thread)
    connectionRepository.save(connection)
    serviceRepository.save(service)
    log.info('core', 'Added thread #' + threadId + ' to connection ' + connName)
  }

  @HelpMessage('Removes thread from given connection with specified service instance')
  public async removeThreadWithDefaultInstance(
    @CLIArgument({ name: CLIArguments.CONNECTION }) connName: string,
    @CLIArgument({ name: CLIArguments.SERVICE }) serviceName: string,
    @CLIArgument({ name: CLIArguments.THREAD }) threadId: string,
    @CLIArgument({ name: CLIArguments.REMOVE }) _: boolean) {
    await this.removeThread(connName, serviceName, 'default', threadId, true)
  }

  @HelpMessage('Creates new thread in given connection with default service instance')
  public async addThreadWithDefaultInstance(
    @CLIArgument({ name: CLIArguments.CONNECTION }) connName: string,
    @CLIArgument({ name: CLIArguments.SERVICE }) serviceName: string,
    @CLIArgument({ name: CLIArguments.THREAD }) threadId: string,
    @CLIArgument({ name: CLIArguments.ADD }) _: boolean) {
    await this.addThread(connName, serviceName, 'default', threadId, true)
  }

  @HelpMessage('Lists all connections')
  public async connections(@CLIArgument({ name: CLIArguments.CONNECTION, descriptionOverride: DescriptionFlags.IGNORE }) _: boolean) {
    const connectionsRepository = this.connection.getRepository(ThreadConnection)
    const connections = await connectionsRepository.find(
      {
        join: {
          alias: 'connection',
          leftJoinAndSelect: {
            threads: 'connection.threads',
            service: 'threads.service',
          },
        },
      })
    for (const connection of connections) {
      const indexText = chalk.gray(connection.id + '')
      log.info(indexText, chalk.greenBright(connection.connectionName))
      log.info(indexText, 'Threads:')
      for (const thread of connection.threads) {
        log.info(indexText, chalk.blueBright(thread.service.moduleName + '.' + thread.service.instanceName) + chalk.greenBright('#' + thread.externalServiceId))
      }
    }
  }

  @HelpMessage('Removes service instance')
  public async removeInstance(
    @CLIArgument({ name: CLIArguments.SERVICE }) serviceName: string,
    @CLIArgument({ name: CLIArguments.INSTANCE }) newInstanceName: string,
    @CLIArgument({ name: CLIArguments.REMOVE }) _: boolean) {
    const serviceRepository = this.connection.getRepository(Service)
    const instance = await serviceRepository.findOne({ moduleName: serviceName, instanceName: newInstanceName })
    if (!instance) {
      log.error('services', 'Given service instance does not exist')
      return
    }

    await serviceRepository.remove(instance)

    log.info('services', 'Removed instance ' + newInstanceName + ' of service ' + serviceName)
  }

  @HelpMessage('Removes default service instance')
  public async removeDefaultInstance(
    @CLIArgument({ name: CLIArguments.SERVICE }) serviceName: string,
    @CLIArgument({ name: CLIArguments.REMOVE }) _: boolean) {
    await this.removeInstance(serviceName, 'default', true)
  }

  @HelpMessage('Creates and configures new service instance')
  public async newInstance(
    @CLIArgument({ name: CLIArguments.SERVICE }) serviceName: string,
    @CLIArgument({ name: CLIArguments.INSTANCE }) newInstanceName: string,
    @CLIArgument({ name: CLIArguments.ADD }) _: boolean) {
    const serviceRepository = this.connection.getRepository(Service)
    const availableServices = await this.context.serviceManager.getAvailableServices()
    const serviceModule = availableServices.find((el) => el.moduleName === serviceName)

    if (!serviceModule) {
      log.error('services', 'Service with given name does not exist')
      return
    }

    const instance = await serviceRepository.findOne({ moduleName: serviceName, instanceName: newInstanceName  })
    if (instance) {
      log.error('services', 'Instance with given name already exists!')
      return
    }

    const wizard = new CLIConfigWizard()

    const confSchema = require(serviceModule.modulePath).Config
    log.info('services', 'Configuring instance ' + newInstanceName + ' of service ' + serviceName)
    const configuration = await wizard.promptForConfig(confSchema)
    fs.writeFileSync(
      path.join(
        CONFIG_FOLDER_PATH,
        serviceModule.moduleName +
          '.' +
          newInstanceName +
          '.toml',
      ),
      TOML.stringify(configuration),
    )

    const service = new Service()
    service.configured = true
    service.enabled = true
    service.instanceName = newInstanceName
    service.moduleName = serviceModule.moduleName

    await serviceRepository.save(service)

    log.info('services', 'Created and configured instance ' + newInstanceName + ' of service ' + serviceName)
  }

  @HelpMessage('Creates and configures default service instance')
  public async newDefaultInstance(
    @CLIArgument({ name: CLIArguments.SERVICE }) serviceName: string,
    @CLIArgument({ name: CLIArguments.ADD }) _: boolean) {
    await this.newInstance(serviceName, 'default', true)
  }

  @HelpMessage('Reconfigures instance of given service')
  public async reconfigureInstance(
    @CLIArgument({ name: CLIArguments.SERVICE }) serviceName: string,
    @CLIArgument({ name: CLIArguments.INSTANCE }) newInstanceName: string,
    @CLIArgument({ name: CLIArguments.CONFIGURE }) _: boolean) {
    const serviceRepository = this.connection.getRepository(Service)

    const instance = await serviceRepository.findOne({ moduleName: serviceName, instanceName: newInstanceName  })
    const serviceModule = (await this.context.serviceManager.getAvailableServices()).find((el) => el.moduleName === serviceName)
    if (!serviceModule) {
      log.error('services', 'Given service does not exist')
      return
    }

    if (!instance) {
      log.error('services', 'Instance of given service does not exist')
      return
    }

    const wizard = new CLIConfigWizard()
    const confSchema = require(serviceModule.modulePath).Config
    log.info('services', 'Reconfiguring instance ' + newInstanceName + ' of service ' + serviceName)
    const configuration = await wizard.promptForConfig(confSchema)
    fs.writeFileSync(
      path.join(
        CONFIG_FOLDER_PATH,
        serviceName +
        '.' +
        newInstanceName +
        '.toml',
      ),
      TOML.stringify(configuration),
    )

    log.info('services', 'New configuration saved.')
  }

  @HelpMessage('Reconfigures default instance of given service')
  public async reconfigureDefaultInstance(
    @CLIArgument({ name: CLIArguments.SERVICE }) serviceName: string,
    @CLIArgument({ name: CLIArguments.CONFIGURE }) _: boolean) {
    await this.reconfigureInstance(serviceName, 'default', true)
  }

  @HelpMessage('Lists all services')
  public async services(@CLIArgument({ name: CLIArguments.SERVICE, descriptionOverride: DescriptionFlags.IGNORE }) _: boolean) {
    const serviceRepository = this.connection.getRepository(Service)

    const services = await this.context.serviceManager.getAvailableServices()
    for (const service of services) {
      console.log('')
      console.log('Service ' + chalk.redBright(service.moduleName))
      console.log(chalk.green(service.displayName) + chalk.greenBright(' v' + service.version))
      console.log(chalk.blue(service.description))
      const serviceInstances = await serviceRepository.find({ moduleName: service.moduleName })
      if (serviceInstances.length > 0) {
        console.log('instances: ' + serviceInstances.map((el) => { return el.enabled ? chalk.green(el.instanceName) : chalk.red(el.instanceName) }).join(', '))
      }
    }
  }

  @HelpMessage('Disable instance of given service')
  public async disableServiceInstance(
    @CLIArgument({ name: CLIArguments.SERVICE }) serviceName: string,
    @CLIArgument({ name: CLIArguments.INSTANCE }) newInstanceName: string,
    @CLIArgument({ name: CLIArguments.DISABLE }) _: boolean) {
    const serviceRepository = await this.connection.getRepository(Service)
    const instance = await serviceRepository.findOne({ moduleName: serviceName, instanceName: newInstanceName })

    if (!instance) {
      log.info('services', 'Given service instance does not exist')
      return
    }

    instance.enabled = false
    serviceRepository.save(instance)
    log.info('services', 'Disabled instance ' + newInstanceName + ' of service ' + serviceName)
  }

  @HelpMessage('Enable instance of given service')
  public async enableServiceInstance(
    @CLIArgument({ name: CLIArguments.SERVICE }) serviceName: string,
    @CLIArgument({ name: CLIArguments.INSTANCE }) newInstanceName: string,
    @CLIArgument({ name: CLIArguments.ENABLE }) _: boolean) {
    const serviceRepository = await this.connection.getRepository(Service)
    const instance = await serviceRepository.findOne({ moduleName: serviceName, instanceName: newInstanceName })

    if (!instance) {
      log.info('services', 'Given service instance does not exist')
      return
    }

    instance.enabled = true
    serviceRepository.save(instance)
    log.info('services', 'Enabled instance ' + newInstanceName + ' of service ' + serviceName)
  }

  @HelpMessage('Disable default instance of given service')
  public async disableDefaultServiceInstance(
    @CLIArgument({ name: CLIArguments.SERVICE }) serviceName: string,
    @CLIArgument({ name: CLIArguments.DISABLE }) _: boolean) {
    await this.disableServiceInstance(serviceName, 'default', true)
  }

  @HelpMessage('Enable default instance of given service')
  public async enableDefaultServiceInstance(
    @CLIArgument({ name: CLIArguments.SERVICE }) serviceName: string,
    @CLIArgument({ name: CLIArguments.ENABLE }) _: boolean) {
    await this.enableServiceInstance(serviceName, 'default', true)
  }
}
