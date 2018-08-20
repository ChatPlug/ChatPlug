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
import ServicesController from './controllers/ServicesController'
import { Server } from 'http'

export default class ApiService extends ChatPlugService {
  app: Application
  httpServer: Server
  async initialize() {
    useContainer(new ContextContainer(this.context))
    this.app = createExpressServer({
      routePrefix: '/api/v1',
      controllers: [ConnectionsController, ServicesController],
      middlewares: [ErrorMiddleware],
      interceptors: [ResponseMiddleware],
      defaultErrorHandler: false,
    }) as Application

    await new Promise(
      res => (this.httpServer = this.app.listen(this.config.port, _ => res)),
    )
    log.info('api', 'API listening on port ' + this.config.port)
  }

  async terminate() {
    log.info('api', 'Closing API server')
    await this.httpServer.close()
  }
}
