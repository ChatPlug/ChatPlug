import ChatPlugContext from '../../ChatPlugContext'

export default class ContextContainer {
  context: ChatPlugContext
  constructor(context: ChatPlugContext) {
    this.context = context
  }

  get<T>(controller: any): T {
    const className = controller.name
    return new controller(this.context)
  }
}
