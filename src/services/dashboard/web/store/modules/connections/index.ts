/* tslint:disable:object-shorthand-properties-first*/

import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import ConnectionsState from './ConnectionsState'
import { Module } from 'vuex'

export const state: ConnectionsState = {
  connections: [],
}

export default <Module<ConnectionsState, {}>>{
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
}
