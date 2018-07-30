import ChatPlugContext from '../../ChatPlugContext'
import CLIArgumentOptions, {
  CLIArguments,
  parameterListMetadataKey,
  functionListMetadataKey } from './CLIArguments'
import CLIArgument from './CLIArgument'
import log from 'npmlog'
import { Connection } from 'typeorm'
import ThreadConnection from '../../entity/ThreadConnection'
import Thread from '../../entity/Thread'
import Service from '../../entity/Service'
import chalk from 'chalk'
import { ChatPlug } from '../../ChatPlug'

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
      const sortedParameters = parameters.sort((a, b) => { return a.propertyIndex!! - b.propertyIndex!! })
      if (sortedParameters.every((item) => argv[item.name] !== undefined)) {
        await this[key].apply(this, sortedParameters.map((item) => { return argv[item.name] }))
        return
      }
    }

    log.error('core', 'Invalid command')
  }

  public async run(@CLIArgument({ name: CLIArguments.RUN }) _: boolean) {
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

  public async addConnection(@CLIArgument({ name: CLIArguments.ADD_CONNECTION }) connectionName: string) {
    const repository = this.connection.getRepository(ThreadConnection)
    const connection = new ThreadConnection()
    connection.connectionName = connectionName
    connection.threads = []
    const result = await repository.save(connection)
    log.info('core', 'Added connection ' + result.connectionName)
  }

  public async addThread(
    @CLIArgument({ name: CLIArguments.CONNECTION }) connName: string,
    @CLIArgument({ name: CLIArguments.ADD_THREAD }) serviceName: string,
    @CLIArgument({ name: CLIArguments.THREAD_ID }) threadId: string) {
    const serviceRepository = this.connection.getRepository(Service)
    const connectionRepository = this.connection.getRepository(ThreadConnection)
    const connection = await connectionRepository.findOne({ connectionName: connName })
    const service = await serviceRepository.findOne({ where: { moduleName: serviceName }, relations: ['threads'] })

    if (service && connection) {
      const thread = new Thread()
      thread.externalServiceId = threadId
      thread.service = service
      thread.threadConnection = connection
      connection.threads.push(thread)
      connectionRepository.save(connection)
      serviceRepository.save(service)
      log.info('core', 'Added thread #' + threadId + ' to connection ' + connName)
    }
  }

  public async listConnections(@CLIArgument({ name: CLIArguments.LIST_CONNECTIONS }) _: boolean) {
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
}
