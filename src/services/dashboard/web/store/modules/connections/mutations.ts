/* tslint:disable:function-name */
import * as actions from './actions.types'
import { ThreadConnection } from './types'
import Vue from 'vue'

export default {
  [actions.SET_CONNECTIONS] (state, payload) {
    state.connections = payload
  },

  [actions.SET_NEW_CONNECTION_ID](state, payload: number) {
    state.newConnectionId = payload
  },

  [actions.UPDATE_CONNECTION](state, payload: ThreadConnection) {
    const index = state.connections.findIndex((el) => el.id === payload.id)

    if (index === -1) {
      state.connections.push(payload)
    } else {
      console.log(payload)
      Vue.set(state.connections, index, payload)
    }
  },
}
