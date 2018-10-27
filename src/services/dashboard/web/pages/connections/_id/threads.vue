<template>
    <v-list two-list avatar>
      <template v-if="currentConnection.threads !== null && currentConnection.threads.filter((el) => !el.deleted).length > 0" v-for="(thread, index) in currentConnection.threads.filter((el) => !el.deleted)">
        <v-divider :key="index + '-divider'"></v-divider>
        <v-list-tile :key="index + '-real-elem'">
        <v-list-tile-avatar v-if="thread.avatarUrl">
          <img :src="thread.avatarUrl"/>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title v-text="thread.subtitle"></v-list-tile-title>
          <v-list-tile-sub-title v-text="thread.title"></v-list-tile-sub-title>
        </v-list-tile-content>
          <v-list-tile-action>
            <v-btn icon ripple @click="deleteThread({ threadId: thread.id, connId: currentConnection.id })">
              <v-icon>clear</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </template>
      <template v-if="currentConnection.threads == null || currentConnection.threads.length === 0">
        <div>&nbsp; There is no threads</div>
      </template>
    </v-list>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { State, namespace, Action } from 'vuex-class'
import * as actions from '../../../store/modules/connections/actions.types'

const connectionsModule = namespace('connections')

@Component({})
export default class extends Vue {
  @Prop() currentConnection
  @connectionsModule.Action(actions.DELETE_THREAD) deleteThread

  get threads() {
    if (!this.currentConnection) {
      return null
    }
    return this.currentConnection.threads || null
  }

  async created() {
  }

}
</script>
<style scoped>
</style>
