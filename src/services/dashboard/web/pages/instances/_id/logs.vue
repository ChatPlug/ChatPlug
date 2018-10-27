<template>
    <v-list two-list>
      <template v-if="logs !== null && logs.length > 0" v-for="(log, index) in logs">
        <v-divider :key="index + '-divider'"></v-divider>
        <v-list-tile :key="index + '-real-elem'">
        <v-list-tile-content>
          <v-list-tile-title v-text="log.message"></v-list-tile-title>
          <v-list-tile-sub-title v-text="prettyTime(log)"></v-list-tile-sub-title>
        </v-list-tile-content>
          <v-list-tile-action>

            <v-btn icon ripple>

              <v-icon color="blue" v-if="log.logLevel === 'info'">info</v-icon>
              <v-icon color="green" v-if="log.logLevel === 'debug'">bug_report</v-icon>
              <v-icon color="red" v-if="log.logLevel === 'fatal'">error</v-icon>
              <v-icon color="red" v-if="log.logLevel === 'error'">error_outline</v-icon>
              <v-icon color="orange" v-if="log.logLevel === 'warn'">warning</v-icon>

            </v-btn>

          </v-list-tile-action>

        </v-list-tile>

      </template>
      <template v-if="logs == null || logs.length === 0">
        <div>&nbsp; There is no logs</div>
      </template>
    </v-list>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { State, namespace, Action } from 'vuex-class'
import * as actions from '../../../store/modules/services/actions.types'
import { distanceInWords, distanceInWordsToNow } from 'date-fns'

const servicesModule = namespace('services')

@Component({})
export default class extends Vue {
  @Prop() currentInstance
  @servicesModule.Action(actions.LOAD_LOGS) loadLogs

  async created() {
    this.loadLogs({ id: this.currentInstance.id })
  }

  prettyTime(log) {
    return distanceInWordsToNow(log.createdAt) + ' ago'
  }
  get logs() {
    if (!this.currentInstance) {
      return null
    }
    return this.currentInstance.logs || null
  }
}
</script>
<style scoped>
</style>
