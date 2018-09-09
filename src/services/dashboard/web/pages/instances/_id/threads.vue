<template>
    <v-list two-list>
      <template v-if="threads !== null && threads.length > 0" v-for="(thread, index) in threads">
        <v-divider :key="index + '-divider'"></v-divider>
        <v-list-tile :key="index + '-real-elem'">
          <v-list-tile-content>
            <v-list-tile-title  v-text="thread.externalServiceId">
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
      <template v-if="threads == null || threads.length === 0">
        <div>&nbsp; There is no threads</div>
      </template>
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
  @servicesModule.Action(actions.LOAD_INSTANCE_THREAD) loadThreads

  async created() {
    this.loadThreads({ id: this.currentInstance.id })
  }
  get threads() {
    if (!this.currentInstance) {
      return null
    }
    return this.currentInstance.threads || null
  }
}
</script>
<style scoped>
</style>
