import { GetterTree } from 'vuex'
import ServicesState from './ServicesState'

export default <GetterTree<ServicesState, {}>>{
  instances: state => state.instances,
  modules: state => state.modules,
  newInstanceId: state => state.newInstanceId,
  searchResults: state => state.searchResults,
}
