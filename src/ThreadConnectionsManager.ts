import log from 'npmlog'
import { IChatPlugConnection, IChatPlugThread } from './models'

export class ThreadConnectionsManager {
  connections: IChatPlugConnection[]

  constructor (connections: IChatPlugConnection[]) {
    this.connections = connections
    log.info('', `Registered ${connections.length} service connections`)
  }

  getAllReceiversForThread (thread: IChatPlugThread): IChatPlugThread[] {
    const threads: IChatPlugThread[] = []

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
