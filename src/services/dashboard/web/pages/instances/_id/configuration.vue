<template>
  <v-container>
    <v-checkbox :input-value="currentInstance.primaryMode" label="Primary service"/>
    <EditableLabel label="Instance name" :value="currentInstance.instanceName" @input="updateInsanceName"/>
    <v-divider/>
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
import EditableLabel from '../../../components/EditableLabel.vue'

const servicesModule = namespace('services')

@Component({
  components: {
    EditableLabel: EditableLabel as any,
  },
})
export default class extends Vue {
  @Prop() currentInstance: ServiceInstance
  @servicesModule.Action(actions.LOAD_INSTANCE_CONFIG_SCHEMA)
  loadInstanceConfigSchema
  @servicesModule.Action(actions.CONFIGURE_INSTANCE)
    configureInstance
  @servicesModule.Action(actions.UPDATE_DB_INSTANCE)
    updateInstance
  schemaConfig = {}
  unmodifiedConfig = {}

  async updateInsanceName(instanceName) {
    this.updateInstance({ id: this.currentInstance.id, instance: { instanceName } })
  }

  async created() {
    if (!this.configSchema) {
      this.loadInstanceConfigSchema({ id: this.currentInstance.id })
    } else {
      for (const item of this.currentInstance.serviceModule.configSchema!!) {
        this.schemaConfig[item['name']!!] = item['value']
      }
    }
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
