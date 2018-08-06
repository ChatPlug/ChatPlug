import { JsonController, Get, Param } from 'routing-controllers'
import ChatPlugContext from '../../../ChatPlugContext'
import ThreadConnection from '../../../entity/ThreadConnection'

@JsonController('/connections')
export default class ConnectionsController {
  context: ChatPlugContext
  constructor (context: ChatPlugContext) {
    this.context = context
  }

  @Get('/')
  async getConnections() {
    return this.context.connection.getRepository(ThreadConnection).find()
  }

  @Get('/:id')
  async getConnectionById(@Param('id') idNumber : number) {
    return this.context.connection.getRepository(ThreadConnection).findOne({ id: idNumber })
  }

  @Get('/:id/messages')
  async getMessages(@Param('id') idNumber : number) {
    const connection = await this.context.connection.getRepository(ThreadConnection)
      .findOne({ id: idNumber }, { relations: ['messages'] })
    if (connection) {
      return connection.messages
    }
    return { error: 'Invalid connection' }
  }
}
