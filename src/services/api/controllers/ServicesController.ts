import { JsonController, Get, Param } from 'routing-controllers'
import ChatPlugContext from '../../../ChatPlugContext'
import { classToPlain } from 'class-transformer'

@JsonController('/services')
export default class ServicesController {
  context: ChatPlugContext
  constructor(context: ChatPlugContext) {
    this.context = context
  }
  @Get('/')
  getServices() {
    return this.context.serviceManager
      .getRegisteredServices()
      .map(s => classToPlain(s))
  }
}
