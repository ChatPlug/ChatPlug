/* tslint:disable:object-shorthand-properties-first*/

import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import { Module } from 'vuex'
import UpdaterState from './UpdaterState'

export const state: UpdaterState = {
  currentVersion: '',
}

export default <Module<UpdaterState, {}>>{
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
}
