/* tslint:disable:function-name */
import { ActionTree } from 'vuex'
import axios from '~/axios'
import * as action from './actions.types'
import ServicesState from './ServicesState'
import encodeParams from '../../../encodeParams'

export default <ActionTree<ServicesState, {}>>{
  async [action.LOAD_VERSION](store, { id }: { id: number }) {
    await axios.get('https://api.github.com/repos/feelfreelinux/chatplug/releases/latest')
    store.dispatch(action.LOAD_VERSION)
  },
}
