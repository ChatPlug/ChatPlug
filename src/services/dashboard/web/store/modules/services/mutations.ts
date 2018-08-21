/* tslint:disable:function-name */
import * as actions from './actions.types'
export default {
  [actions.SET_INSTANCES] (state, payload) {
    state.instances = payload
  },
}
