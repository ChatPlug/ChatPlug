
<template>
  <v-container>

    <template v-for="configField in configSchema">
      <v-layout :key="configField.name">
        <v-text-field v-if="configField.type === 'STRING'" :label="configField.name" :hint="configField.hint"></v-text-field>
        <v-text-field v-else-if="configField.type === 'NUMBER'" :label="configField.name" :hint="configField.hint" type="number"></v-text-field>
        <v-checkbox v-else-if="configField.type === 'BOOLEAN'" :label="configField.name" />
        <v-tooltip left>
          <v-btn flat icon color="grey darken-1" slot="activator">
            <v-icon>info</v-icon>
          </v-btn>
          <span>{{configField.hint}}</span>
        </v-tooltip>
      </v-layout>
    </template>

  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { State, namespace, Action } from 'vuex-class'
import * as actions from '../../../store/modules/services/actions.types'
import ServiceInstance from '../../../types/ServiceInstance'

const servicesModule = namespace('services')

@Component({})
export default class extends Vue {
  @Prop() currentInstance: ServiceInstance
  @servicesModule.Action(actions.LOAD_INSTANCE_CONFIG_SCHEMA)
  loadInstanceConfigSchema
  created() {
    this.loadInstanceConfigSchema({ id: this.currentInstance.id })
  }
  get configSchema() {
    if (!this.currentInstance) {
      return null
    }
    return this.currentInstance.serviceModule.configSchema || null
  }
}
</script>
<style scoped>
</style>
