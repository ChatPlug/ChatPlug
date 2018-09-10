import { JsonController, Get, Param, Post, BodyParam, Delete } from 'routing-controllers'
import ChatPlugContext from '../../../ChatPlugContext'
import ThreadConnection from '../../../entity/ThreadConnection'
import { Repository } from 'typeorm'
import Thread from '../../../entity/Thread'
import Service from '../../../entity/Service'

@JsonController('/connections')
export default class ConnectionsController {
  connectionsRepository: Repository<ThreadConnection>
  context: ChatPlugContext
  constructor(context: ChatPlugContext) {
    this.context = context
    this.connectionsRepository = context.connection.getRepository(ThreadConnection)
  }

  @Get('/')
  async getConnections() {
    return this.connectionsRepository.find()
  }

  @Get('/:id')
  async getConnectionById(@Param('id') id : number) {
    return this.connectionsRepository.findOne({ id })
  }

  @Delete('/:id')
  async deleteConnetionById(@Param('id') id : number) {
    const foundConnection = await this.connectionsRepository.findOne({ id })
    return this.connectionsRepository.remove(foundConnection!!)
  }

  @Get('/:id/messages')
  async getMessages(@Param('id') id : number) {
    const connection = await this.connectionsRepository.findOne({ id }, { relations: ['messages'] })
    if (connection) {
      return connection.messages
    }
    return { error: 'Invalid connection' }
  }

  @Post('/')
  async createConnection(@BodyParam('connectionName', { required: true }) connectionName : string) {
    const connection = new ThreadConnection()
    connection.connectionName = connectionName
    await this.connectionsRepository.save(connection)
    return connection
  }

  @Post('/:id/threads')
  async createThread(
    @Param('id') connectionId : number,
    @BodyParam('externalThreadId', { required: true }) threadId : string,
    @BodyParam('serviceId', { required: true }) instanceId : number) {
    const servicesRepository = this.context.connection.getRepository(Service)
    const threadsRepository = this.context.connection.getRepository(Thread)

    const connection = await this.connectionsRepository.findOneOrFail({ id: connectionId })
    const service = await servicesRepository.findOneOrFail({ id: instanceId })

    const thread = new Thread()
    thread.externalServiceId = threadId
    thread.service = service
    thread.threadConnection = connection

    threadsRepository.save(thread)
    return thread
  }

  @Delete('/:connId/threads/:id')
  async deleteThreadById(
    @Param('connId') connId : number,
    @Param('id') id : number) {
    const threadsRepository = this.context.connection.getRepository(Thread)
    const foundThread = await threadsRepository.findOne({ id })
    await threadsRepository.remove(foundThread!!)
    return this.connectionsRepository.findOneOrFail({ id: connId })
  }
}
