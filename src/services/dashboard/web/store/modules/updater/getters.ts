import { GetterTree } from 'vuex'
import UpdaterState from './UpdaterState'

export default <GetterTree<UpdaterState, {}>>{
  currentVersion: state => state.currentVersion,
}
