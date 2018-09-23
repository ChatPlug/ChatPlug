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

  async [action.DELETE_CONNECTION] (store, { id } : { id: number }) {
    const { data } = await axios.delete(`connections/${id}`)
    if (data.data) {
      store.dispatch(action.LOAD_CONNECTIONS)
    }
  },

  async [action.CREATE_CONNECTION] (store, payload: { connectionName: string }) {
    const { data } = await axios.post('connections', payload)
    if (data.data) {
      store.commit(action.SET_NEW_CONNECTION_ID, data.data.id)
      store.commit(action.UPDATE_CONNECTION, data.data)
    }

    store.dispatch(action.LOAD_CONNECTIONS)
  },

  async [action.CREATE_NEW_THREAD] (store, payload: { title: string, subtitle: string | null, avatarUrl: string | null, externalThreadId: string, serviceId: number, connId: number }) {
    const { data } = await axios.post(`connections/${payload.connId}/threads`, payload)

    if (data.data) {
      store.commit(action.UPDATE_CONNECTION, data.data)
    }
  },
}
