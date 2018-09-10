/* tslint:disable:function-name */
import { MutationTree } from 'vuex'
import * as actions from './actions.types'
import UpdaterState from './UpdaterState'

export default <MutationTree<UpdaterState>>{
  [actions.SET_VERSION](state, payload: { currentVersion: string }) {
    state.currentVersion = payload.currentVersion
  },
}
