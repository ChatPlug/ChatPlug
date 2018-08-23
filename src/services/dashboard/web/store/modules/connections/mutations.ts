/* tslint:disable:function-name */
import * as actions from './actions.types'
export default {
  [actions.SET_CONNECTIONS] (state, payload) {
    state.connections = payload
  },
}
