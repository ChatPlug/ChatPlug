
<template>

  <v-list>
      <v-subheader>Status</v-subheader>
        <v-divider></v-divider>
        <v-list-tile v-if="currentInstance.configured && currentInstance.enabled">
          <v-list-tile-content>
            <v-list-tile-title color=green v-if="currentInstance.status === 'running'">
              Service is running
            </v-list-tile-title>
            <v-list-tile-title color=green v-if="currentInstance.status === 'crashed'">
              Service has crashed
            </v-list-tile-title>
            <v-list-tile-title color=green v-if="currentInstance.status === 'starting'">
              Service is starting up
            </v-list-tile-title>
            <v-list-tile-title color=green v-if="currentInstance.status === 'terminating'">
              Service is shutting down
            </v-list-tile-title>
            <v-list-tile-title color=green v-if="currentInstance.status === 'shutdown'">
              Service is shutdown
            </v-list-tile-title>
          </v-list-tile-content>
              <v-list-tile-action v-if="currentInstance.status === 'running'">
                <v-btn icon ripple @click="restart()">
                  <v-icon color=blue>refresh</v-icon>
                </v-btn>
              </v-list-tile-action>
              <v-list-tile-action v-if="currentInstance.status === 'shutdown'">
                <v-btn icon @click="startUp()">
                  <v-icon color=green>flash_on</v-icon>
                </v-btn>
              </v-list-tile-action>
              <v-list-tile-action  v-if="currentInstance.status === 'running'">
                <v-btn icon @click="terminate()">
                  <v-icon color=red>flash_off</v-icon>
                </v-btn>
              </v-list-tile-action>

              <v-list-tile-action v-if="currentInstance.status === 'starting'">
                <v-progress-circular indeterminate color="green"/>
              </v-list-tile-action>

              <v-list-tile-action v-if="currentInstance.status === 'terminating'">
                <v-progress-circular indeterminate color="red"/>
              </v-list-tile-action>
        </v-list-tile>
          <v-list-tile v-else>
          <v-list-tile-content>
            <v-list-tile-title color=green v-if="currentInstance.configured === false">
              Service is not configured
            </v-list-tile-title>
            <v-list-tile-title color=green v-else-if="currentInstance.enabled === false">
              Service is not enabled
            </v-list-tile-title>
          </v-list-tile-content>
              <v-list-tile-action v-if="currentInstance.configured === false">
                <v-btn icon ripple>
                  <v-icon color=red>error</v-icon>
                </v-btn>
              </v-list-tile-action>
              <v-list-tile-action v-else-if="currentInstance.enabled === false">
                <v-btn icon ripple @click="enable()">
                  <v-icon color=green>play_circle_filled</v-icon>
                </v-btn>
              </v-list-tile-action>
        </v-list-tile>
        <v-subheader>Information</v-subheader>
          <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title color=green>
              Name
            </v-list-tile-title>
            <v-list-tile-sub-title>{{ currentInstance.serviceModule.displayName }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider/>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title color=green>
              Description
            </v-list-tile-title>
            <v-list-tile-sub-title>{{ currentInstance.serviceModule.modulePath }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
    </v-list>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { State, namespace, Action } from 'vuex-class'
import * as actions from '../../../store/modules/services/actions.types'

const servicesModule = namespace('services')
@Component({})
export default class extends Vue {
  @Prop() currentInstance
  @servicesModule.Action(actions.START_INSTANCE) startInstance
  @servicesModule.Action(actions.SHUTDOWN_INSTANCE) shutdownInstance
  @servicesModule.Action(actions.RESTART_INSTANCE) restartInstance
  @servicesModule.Action(actions.ENABLE_INSTANCE) enableInstance

  startUp() {
    this.startInstance({ id: this.currentInstance.id })
  }

  terminate() {
    this.shutdownInstance({ id: this.currentInstance.id })
  }

  restart() {
    this.restartInstance({ id: this.currentInstance.id })
  }

  enable() {
    this.enableInstance({ id: this.currentInstance.id })
  }
}
</script>
<style scoped></style>


