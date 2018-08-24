import { GetterTree } from 'vuex'
import ServicesState from './ServicesState'

export default <GetterTree<ServicesState, {}>>{
  instances: state => state.instances,
}
