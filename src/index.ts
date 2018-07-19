import 'reflect-metadata'
import log from 'npmlog'
import { ChatPlug } from './ChatPlug'
import ChatPlugContext from './ChatPlugContext'
import ThreadConnection from './entity/ThreadConnection'
import Thread from './entity/Thread'
import Service from './entity/Service'

const argv = require('minimist')(process.argv.slice(2), {
  string: ['addConnection', 'a', 'addThread', 't', 'id', 'i', 'c', 'connection'],
  alias: {
    c: 'connection',
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
    const result = await repository.save(connection)
    log.info('core', 'Added connection ' + result.connectionName)
  }

  if (argv.c && argv.t && argv.i) {
    const serviceRepository = context.connection.getRepository(Service)
    const repository = context.connection.getRepository(ThreadConnection)
    const threadRepository = context.connection.getRepository(ThreadConnection)
    const connection = await repository.findOne({ connectionName: argv.c })
    const service = await serviceRepository.findOne({ moduleName: argv.t })
    if (service && connection) {
      const thread = new Thread()
      thread.service = service!!
      thread.threadConnection = connection
      thread.threadName = argv.t
      thread.externalServiceId = argv.i
      // await threadRepository.save(thread)
      connection.threads.push(thread)
      await repository.save(connection)
      log.info('core', 'Added new thread')
    }
  }
})
