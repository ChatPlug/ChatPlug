/* tslint:disable:function-name */
import * as action from './actions.types'
import axios from '~/axios'
export default {
  async [action.LOAD_INSTANCES] (store) {
    const instanceList = await axios.get('services/instances')
    store.commit(action.SET_INSTANCES, instanceList)
  },
}
