/* tslint:disable:function-name */
import { ActionTree } from 'vuex'
import axios from '~/axios'
import * as action from './actions.types'
import UpdaterState from './UpdaterState'

export default <ActionTree<UpdaterState, {}>>{
  async [action.LOAD_VERSION](store, { id }: { id: number }) {
    const { tag_name } = await axios.get('https://api.github.com/repos/feelfreelinux/chatplug/releases/latest')

    if (tag_name) {
      store.commit(action.SET_VERSION,  { currentVersion: tag_name })
    }
  },
}
