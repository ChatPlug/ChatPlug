/* tslint:disable:function-name */
import { ActionTree } from 'vuex'
import axios from '~/axios'
import * as action from './actions.types'
import UpdaterState from './UpdaterState'

export default <ActionTree<UpdaterState, {}>>{
  async [action.LOAD_VERSION](store) {
    const { data } = await axios.get('https://api.github.com/repos/feelfreelinux/chatplug/releases/latest')

    if (data.tag_name) {
      store.commit(action.SET_VERSION,  { currentVersion: data.tag_name })
    }
  },
}
