import { ChatPlugService } from '../Service'
import fastify from 'fastify'
import log from 'npmlog'
import 'reflect-metadata'
import ThreadConnection from '../../entity/ThreadConnection'
import { createExpressServer, useContainer } from 'routing-controllers'
import ConnectionsController from './controllers/ConnectionsController'
import { Application } from 'express'
import ContextContainer from './ContextContainer'
import ErrorMiddleware from './ErrorMiddleware'
import ResponseMiddleware from './ResponseMiddleware'

export default class ApiService extends ChatPlugService {
  app: any

  async initialize() {
    useContainer(new ContextContainer(this.context))
    this.app = createExpressServer({
      routePrefix: '/api/v1',
      controllers: [ConnectionsController],
      middlewares: [ErrorMiddleware],
      interceptors: [ResponseMiddleware],
      defaultErrorHandler: false,
    })

    await this.app.listen(this.config.port)
    log.info('api', 'Api listening on port ' + this.config.port)
  }

  async terminate() {
    await this.app.close(() => {})
  }
}
