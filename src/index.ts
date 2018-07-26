import 'reflect-metadata'
import log from 'npmlog'
import { ChatPlug } from './ChatPlug'
import ChatPlugContext from './ChatPlugContext'
import ThreadConnection from './entity/ThreadConnection'
import Thread from './entity/Thread'
import Service from './entity/Service'
import chalk from 'chalk'

const argv = require('minimist')(process.argv.slice(2), {
  string: ['addConnection', 'a', 'addThread', 't', 'id', 'i', 'c', 'connection'],
  alias: {
    c: 'connection',
    l: 'listConnection',
    r: 'run',
    a: 'addConnection',
    t: 'addThread',
    i: 'id',
  },
})

const context = new ChatPlugContext()
context.initializeConnection().then(async () => {
  const chatplug = new ChatPlug(context)

  if (argv.run) {
    chatplug
      .startBridge()
      .then()
      .catch()

    process.on('SIGINT', () => {
      log.info('', 'Logging out...')
      chatplug
        .stopBridge()
        .then(() => process.exit(log.info('', 'Logged out') || 0))
        .catch(err => process.exit(log.error('', err) || 1))
    })
  }

  if ((argv.a)) {
    const repository = context.connection.getRepository(ThreadConnection)
    const connection = new ThreadConnection()
    connection.connectionName = argv.a
    connection.threads = []
    const result = await repository.save(connection)
    log.info('core', 'Added connection ' + result.connectionName)
  }

  if (argv.c && argv.t && argv.i) {
    const serviceRepository = context.connection.getRepository(Service)
    const connectionRepository = context.connection.getRepository(ThreadConnection)
    const connection = await connectionRepository.findOne({ connectionName: argv.c })
    const service = await serviceRepository.findOne({ moduleName: argv.t })

    if (service && connection) {
      const thread = new Thread()
      thread.externalServiceId = argv.id
      thread.service = service
      thread.threadConnection = connection
      connection.threads.push(thread)
      service.threads.push(thread)
      connectionRepository.save(connection)
      serviceRepository.save(service)
      log.info('core', 'Added thread #' + argv.i + ' to connection ' + argv.c)
    }
  }

  if (argv.l) {
    const connectionsRepository = context.connection.getRepository(ThreadConnection)
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
})
