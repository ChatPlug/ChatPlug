import { ChatPlugService } from '../Service'
import DashboardConfig from './DashboardConfig'
import Service from '../../entity/Service'
import ApiService from '../api/ApiService'
import express from 'express'
import path from 'path'
import Logger, { LogLevel } from '../../Logger'

export default class DashboardService extends ChatPlugService<DashboardConfig> {
  logger = new Logger(this.context)
  async getAPIExpressInstance() {
    const dataFromDB = (await this.context.connection
      .getRepository(Service)
      .find({ where: { moduleName: 'api', enabled: true } }))[0]
    if (!dataFromDB) {
      throw new Error('API service not found!')
    }
    const apiService = this.context.serviceManager.getServiceForId(
      dataFromDB.id as any,
    ) as ApiService
    return apiService.app
  }
  async initialize() {
    if (!this.config.bindToAPIServer) {
      throw new Error('Standalone dashboard server not yet implemented')
    }
    const app = await this.getAPIExpressInstance()
    if (process.env.CHATPLUG_DASHBOARD_DEV_HTTP_HANDLER) {
      this.log(
        LogLevel.INFO,
        ' Using process.env.CHATPLUG_DASHBOARD_DEV_HTTP_HANDLER',
      )
      const rq = eval('req' + 'uire')
      let handler
      try {
        handler = (__REQUIRE_BYPASS_WEBPACK__(process.env.CHATPLUG_DASHBOARD_DEV_HTTP_HANDLER) as any)()
      } catch (e) {
        console.log('ERROR', e)
      }
      app.use((req, res, next) => {
        if (req.url.startsWith('/api')) {
          return next()
        }
        handler(req, res)
      })
    }
    const chatplugStaticDir = process.env.CHATPLUG_DASHBOARD_STATIC_DIR
    if (chatplugStaticDir) {
      this.log(
        LogLevel.INFO,
        ' Using process.env.CHATPLUG_DASHBOARD_STATIC_DIR = ' +
          chatplugStaticDir,
      )
      app.use(express.static(chatplugStaticDir))
      app.get('*', (req, res, next) => {
        if (req.url.startsWith('/api')) {
          return next()
        }
        res.sendFile(path.join(chatplugStaticDir, 'index.html'))
      })
    }
  }

  async terminate() {}
}
