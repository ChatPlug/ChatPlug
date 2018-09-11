/* tslint:disable:function-name */
import { ActionTree } from 'vuex'
import axios from '~/axios'
import * as action from './actions.types'
import ConnectionsState from './ConnectionsState'
import encodeParams from '../../../encodeParams'

export default <ActionTree<ConnectionsState, {}>>{
  async [action.LOAD_CONNECTIONS] (store) {
    const { data } = await axios.get('connections')
    store.commit(action.SET_CONNECTIONS, data.data)
  },

  async [action.CREATE_CONNECTION] (store, payload: { connectionName: string }) {
    const { data } = await axios.post('connections', payload)
    if (data.data) {
      store.commit(action.SET_NEW_CONNECTION_ID, data.data.id)
      store.commit(action.UPDATE_CONNECTION, data.data)
    }

    store.dispatch(action.LOAD_CONNECTIONS)
  },
}
