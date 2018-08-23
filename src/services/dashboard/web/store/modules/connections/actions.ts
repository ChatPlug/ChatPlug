/* tslint:disable:function-name */
import * as action from './actions.types'
import axios from '~/axios'
export default {
  async [action.LOAD_CONNECTIONS] (store) {
    const { data } = await axios.get('connections')
    console.log(data)
    store.commit(action.SET_CONNECTIONS, data.data)
  },
}
