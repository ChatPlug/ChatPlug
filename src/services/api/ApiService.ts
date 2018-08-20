import { ChatPlugService } from '../Service'
import fastify from 'fastify'
import log from 'npmlog'
import ThreadConnection from '../../entity/ThreadConnection'

export default class ApiService extends ChatPlugService {
  app = fastify()

  async initialize() {
    this.app.get('/v1', async (request, reply) => {
      reply.type('application/json').code(200)
      { data: 'Welcome to ChatPlug Api' }
    })

    this.app.get('/v1/connections', async (request, reply) => {
      reply.type('application/json').code(200)

      const connRepo = this.context.connection.getRepository(ThreadConnection)
      const conns = await connRepo.find()
      return { data: conns }
    })

    await this.app.listen(this.config.port)
    log.info('api', 'Api listening on port ' + this.config.port)
  }

  async terminate() {
    await this.app.close(() => {})
  }
}
