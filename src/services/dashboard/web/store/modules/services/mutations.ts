/* tslint:disable:function-name */
import ServiceInstance from 'types/ServiceInstance'
import ServiceModule from 'types/ServiceModule'
import ServiceUser from 'types/ServiceUser'
import ServiceThread from 'types/ServiceThread'
import { MutationTree } from 'vuex'
import * as actions from './actions.types'
import ServicesState from './ServicesState'
import Vue from 'vue'
import { SOCKET_ONOPEN } from 'vue-native-websocket'

export default <MutationTree<ServicesState>>{
  [actions.SET_INSTANCES](state, payload: ServiceInstance[]) {
    for (const instance of payload) {
      const found = state.instances.find((el) => el.id === instance.id)
      if (found) {
        instance.serviceModule.configSchema = found.serviceModule.configSchema
      }
    }
    state.instances = payload
  },

  [actions.SET_MODULES](state, payload: ServiceModule[]) {
    state.modules = payload
  },

  [actions.UPDATE_INSTANCE](state, payload: ServiceInstance) {
    const index = state.instances.findIndex((el) => el.id === payload.id)
    Vue.set(state.instances, index, payload)
  },

  [actions.SET_ENABLED](state, { id, enabled } : { id: number, enabled: boolean }) {
    const found = state.instances.find((el) => el.id === id)
    if (found) {
      found.enabled = enabled
    }
  },

  [actions.SET_NEW_INSTANCE_ID](state, payload: number) {
    state.newInstanceId = payload
  },

  [actions.UPDATE_INSTANCE_STATUS](state, { serviceId, statusUpdate }: { serviceId: number, statusUpdate: string }) {
    const instance = state.instances.find(instance => instance.id === serviceId)

    if (!instance) {
      throw new Error(`Failed to find instance with id ${serviceId}`)
    }
    Vue.set(instance, 'status', statusUpdate)
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
    console.log(users)
    Vue.set(instance, 'users', users)
  },
  [actions.SET_INSTANCE_THREAD](
    state: ServicesState,
    { id, threads }: { id: number; threads: ServiceThread[] },
  ) {
    const instance = state.instances.find(instance => instance.id === id)
    if (!instance) {
      throw new Error(`Failed to find instance with id ${id}`)
    }
    Vue.set(instance, 'threads', threads)
  },

  [actions.SET_SEARCH_THREADS](
    state: ServicesState,
    { results }: { results: any[] }) {
    console.log(results)
    state.searchResults = results
  },
}
