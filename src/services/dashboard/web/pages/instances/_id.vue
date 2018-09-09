<style scoped>
</style>
<template>
  <v-card v-if="currentInstance">
    <v-toolbar flat>
      <v-toolbar-title class="grey--text text--darken-4">{{currentInstance.serviceModule.displayName}}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn v-if="currentInstance.enabled === true" flat color="red" @click="disable()">
        Disable
      </v-btn>
      <v-btn v-else flat color="green" @click="enable()">
        Enable
      </v-btn>
      <v-btn flat color="red" @click="removeInstance({ id })" nuxt :to="'/instances/'">
        Delete
      </v-btn>

    </v-toolbar>
    <v-tabs slider-color="primary">
      <v-tab ripple nuxt :to="baseURL + '/status'">
        Status
      </v-tab>
      <v-tab ripple nuxt :to="baseURL + '/configuration'">
        Configuration
      </v-tab>
      <v-tab ripple nuxt :to="baseURL + '/logs'">
        Logs
      </v-tab>
      <v-tab ripple nuxt :to="baseURL + '/threads'">
        Threads
      </v-tab>
      <v-tab ripple nuxt :to="baseURL + '/users'">
        Users
      </v-tab>
    </v-tabs>
    <nuxt-child :currentInstance="currentInstance" />
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import axios from 'axios'
import ServiceInstance from '../../types/ServiceInstance'
import * as actions from '../../store/modules/services/actions.types'
import EditableLabel from '../../components/EditableLabel.vue'
const servicesModule = namespace('services')

@Component({
  components: {
    EditableLabel: EditableLabel as any,
  },
})
export default class InstanceByID extends Vue {
  @servicesModule.Getter('instances') instances: ServiceInstance[]
  @servicesModule.Action(actions.REMOVE_INSTANCE) removeInstance
  @servicesModule.Action(actions.ENABLE_INSTANCE) enableInstance
  @servicesModule.Action(actions.DISABLE_INSTANCE) disableInstance

  id: string
  async asyncData({ params }) {
    return {
      ...params,
      baseURL: `/instances/${params.id}`,
    }
  }

  enable() {
    this.enableInstance({ id: Number(this.id) })
  }

  disable() {
    this.disableInstance({ id: Number(this.id) })
  }

  get currentInstance(): ServiceInstance | undefined {
    if (isNaN(this.id as any)) {
      return undefined
    }
    return this.instances.find(i => i.id === parseInt(this.id, undefined))
  }
}
</script>
