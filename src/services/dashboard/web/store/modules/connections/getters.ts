import { GetterTree } from 'vuex'
import ConnectionsState from './ConnectionsState'

export default <GetterTree<ConnectionsState, {}>>{
  connections: state => state.connections,
  newConnectionId: state => state.newConnectionId,
}
