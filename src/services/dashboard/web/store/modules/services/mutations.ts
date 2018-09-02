/* tslint:disable:function-name */
import ServiceInstance from 'types/ServiceInstance'
import ServiceModule from 'types/ServiceModule'
import { MutationTree } from 'vuex'
import * as actions from './actions.types'
import ServicesState from './ServicesState'

export default <MutationTree<ServicesState>>{
  [actions.SET_INSTANCES](state, payload: ServiceInstance[]) {
    state.instances = payload
  },
  [actions.SET_MODULES](state, payload: ServiceModule[]) {
    state.modules = payload
  },
  [actions.SET_INSTANCE_CONFIG_SCHEMA](
    state: ServicesState,
    { id, configSchema }: { id: number; configSchema },
  ) {
    const instance = state.instances.find(instance => instance.id === id)
    if (!instance) {
      throw new Error(`Failed to find instance with id ${id}`)
    }
    instance.serviceModule.configSchema = configSchema
  },
}
