/* tslint:disable:function-name */
import ServiceInstance from 'types/ServiceInstance'
import ServiceModule from 'types/ServiceModule'
import ServiceUser from 'types/ServiceUser'
import { MutationTree } from 'vuex'
import * as actions from './actions.types'
import ServicesState from './ServicesState'
import Vue from 'vue'

export default <MutationTree<ServicesState>>{
  [actions.SET_INSTANCES](state, payload: ServiceInstance[]) {
    state.instances = payload
  },

  [actions.SET_MODULES](state, payload: ServiceModule[]) {
    state.modules = payload
  },

  [actions.UPDATE_INSTANCE](state, payload: ServiceInstance) {
    const index = state.instances.findIndex((el) => el.id === payload.id)
    state.instances[index] = payload
  },

  [actions.SET_NEW_INSTANCE_ID](state, payload: number) {
    state.newInstanceId = payload
  },

  [actions.SET_INSTANCE_CONFIG_SCHEMA](
    state: ServicesState,
    { id, configSchema }: { id: number; configSchema },
  ) {
    const instance = state.instances.find(instance => instance.id === id)
    if (!instance) {
      throw new Error(`Failed to find instance with id ${id}`)
    }
    Vue.set(instance.serviceModule, 'configSchema', configSchema)
  },
  [actions.SET_INSTANCE_USER](
    state: ServicesState,
    { id, users }: { id: number; users: ServiceUser[] },
  ) {
    const instance = state.instances.find(instance => instance.id === id)
    if (!instance) {
      throw new Error(`Failed to find instance with id ${id}`)
    }
    Vue.set(instance, 'users', users)
  },
}
