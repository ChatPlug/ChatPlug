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
}
