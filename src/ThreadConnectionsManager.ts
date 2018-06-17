import log from 'npmlog'
import { IFacegramConnection, IFacegramThread } from './models'

export class ThreadConnectionsManager {
  connections: IFacegramConnection[]

  constructor (connections: IFacegramConnection[]) {
    this.connections = connections
    log.info('', `Registered ${connections.length} service connections`)
  }

  getAllReceiversForThread (thread: IFacegramThread): IFacegramThread[] {
    const threads: IFacegramThread[] = []

    this.connections.forEach((connection) => {
      if (connection.services.some(e => e.id === thread.id)) {
        connection.services.filter(e => e.id !== thread.id).forEach((filteredThread) => {
          if (!threads.some(e => e.id === filteredThread.id)) {
            threads.push(filteredThread)
          }
        })
      }
    })

    return threads
  }
}
