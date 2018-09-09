
<template>
    <v-list two-list>
      <template v-for="(thread, index) in threads">
        <v-divider :key="index+ '-divider'"></v-divider>
        <v-list-tile :key="thread.id + '-real-elem'">
          <v-list-tile-content>
            <v-list-tile-title  v-text="thread.id">
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
      <template>
        <div>None</div>
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
