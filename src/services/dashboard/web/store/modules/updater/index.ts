/* tslint:disable:object-shorthand-properties-first*/

import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import ServicesState from './ServicesState'
import { Module } from 'vuex'

export const state: ServicesState = {
  instances: [],
  modules: [],
  loading: false,
  newInstanceId: 0,
}

export default <Module<ServicesState, {}>>{
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
}
