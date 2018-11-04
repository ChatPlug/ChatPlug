import cors from 'cors'
import express, { Application } from 'express'
import { Server } from 'http'
import 'reflect-metadata'
import { useContainer, useExpressServer } from 'routing-controllers'
import { Subscription } from 'rxjs'
import { OPEN, Server as WebsocketServer } from 'ws'
import { ChatPlugService } from '../Service'
import ContextContainer from './ContextContainer'
import ConnectionsController from './controllers/ConnectionsController'
import ServicesController from './controllers/ServicesController'
import ErrorMiddleware from './ErrorMiddleware'
import ResponseMiddleware from './ResponseMiddleware'
import { SocketEvent, SocketPacket } from './SocketEvent'

export default class ApiService extends ChatPlugService {
  app: Application
  httpServer: Server
  wsServer: WebsocketServer
  statusSubscription: Subscription

  async initialize() {
    useContainer(new ContextContainer(this.context))
    const serv = express()
    serv.use(cors())
    this.app = useExpressServer(serv, {
      routePrefix: '/api/v1',
      controllers: [ConnectionsController, ServicesController],
      middlewares: [ErrorMiddleware],
      interceptors: [ResponseMiddleware],
      defaultErrorHandler: false,
    }) as Application

    this.wsServer = new WebsocketServer({
      port: 2136,
    })

    this.statusSubscription = this.context.serviceManager.statusSubject.subscribe(
      el => {
        this.broadcastPacket({
          namespace: 'services',
          mutation: SocketEvent.ServiceStatusUpdate,
          data: el,
        })
      },
    )

    new Promise(
      res => (this.httpServer = this.app.listen(this.config.port, _ => res)),
    )
      .then()
      .catch()

    this.logger.info(`API listening on port ${this.config.port}`)
  }

  async terminate() {
    this.logger.info('Closing API server')
    this.statusSubscription.unsubscribe()
    await this.wsServer.close()
    await this.httpServer.close()
  }

  async broadcastPacket(packet: SocketPacket) {
    this.wsServer.clients.forEach(el => {
      if (el.readyState === OPEN) {
        el.send(JSON.stringify(packet))
      }
    })
  }
}
