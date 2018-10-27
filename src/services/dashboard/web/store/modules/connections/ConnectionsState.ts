import ThreadConnection from '../../../types/ThreadConnection'

interface ConnectionsState {
  connections: ThreadConnection[],
  newConnectionId: number,
}
export default ConnectionsState
