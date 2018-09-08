<template>
  <v-container>
    <template v-for="configField in configSchema">
      <v-layout :key="configField.name">
        <v-text-field v-if="configField.type === 'STRING'" :label="configField.name" :hint="configField.hint"  v-model="schemaConfig[configField.name]"></v-text-field>
        <v-text-field v-else-if="configField.type === 'NUMBER'" :label="configField.name" :hint="configField.hint" v-model="schemaConfig[configField.name]" type="number"></v-text-field>
        <v-checkbox v-else-if="configField.type === 'BOOLEAN'" :label="configField.name"  v-model="schemaConfig[configField.name]" />
        <v-tooltip left>
          <v-btn flat icon color="grey darken-1" slot="activator">
            <v-icon>info</v-icon>
          </v-btn>
          <span>{{configField.hint}}</span>
        </v-tooltip>
      </v-layout>
    </template>
    <v-btn color="info" @click="saveConfig()">Save config</v-btn>
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
  @servicesModule.Action(actions.CONFIGURE_INSTANCE)
    configureInstance
  schemaConfig = {}
  unmodifiedConfig = {}

  async created() {
    this.loadInstanceConfigSchema({ id: this.currentInstance.id })
  }

  async saveConfig() {
    this.configureInstance({ id: this.currentInstance.id, config: this.schemaConfig })
  }

  get configSchema() {
    if (!this.currentInstance) {
      return null
    }
    if (this.currentInstance.serviceModule.configSchema) {
      this.unmodifiedConfig = this.currentInstance.serviceModule.configSchema

      for (const item of this.currentInstance.serviceModule.configSchema) {
        this.schemaConfig[item['name']!!] = item['value']
      }
    }
    return this.currentInstance.serviceModule.configSchema || null
  }
}
</script>
<style scoped>
</style>
