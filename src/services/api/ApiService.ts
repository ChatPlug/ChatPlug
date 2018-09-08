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
import { Server as WebsocketServer, OPEN } from 'ws'
import { Server } from 'http'
import { Subscription } from 'rxjs'
import { SocketEvent, SocketPacket } from './SocketEvent'

export default class ApiService extends ChatPlugService {
  app: Application
  httpServer: Server
  wsServer: WebsocketServer
  statusSubscription: Subscription

  async initialize() {
    useContainer(new ContextContainer(this.context))
    this.app = createExpressServer({
      routePrefix: '/api/v1',
      controllers: [ConnectionsController, ServicesController],
      middlewares: [ErrorMiddleware],
      interceptors: [ResponseMiddleware],
      defaultErrorHandler: false,
    }) as Application

    this.wsServer = new WebsocketServer({
      port: 2136,
    })

    this.statusSubscription = this.context.serviceManager.statusSubject.subscribe((el) => {
      this.broadcastPacket({ namespace: 'services', mutation: SocketEvent.ServiceStatusUpdate, data: el })
    })

    await new Promise(
      res => (this.httpServer = this.app.listen(this.config.port, _ => res)),
    )
    log.info('api', 'API listening on port ' + this.config.port)
  }

  async terminate() {
    log.info('api', 'Closing API server')
    this.statusSubscription.unsubscribe()
    await this.httpServer.close()
  }

  async broadcastPacket(packet: SocketPacket) {
    this.wsServer.clients.forEach((el) => {
      if (el.readyState === OPEN) {
        el.send(JSON.stringify(packet))
      }
    })
  }
}
