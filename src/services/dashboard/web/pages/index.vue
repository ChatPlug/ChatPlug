<template>
  <v-container grid-list-md>
  <StatusStats/>
  <v-layout row wrap>
    <v-flex md6 pa-1>
      <StatusInstances/>
    </v-flex>
    <v-flex  md6 pa-1>
      <StatusConnections/>
    </v-flex>
  </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { State, namespace, Action } from 'vuex-class'
import * as actions from '../store/modules/updater/actions.types'
import * as actionsService from '../store/modules/services/actions.types'
import ServiceInstance from '../types/ServiceInstance'
import StatusConnections from '~/components/StatusConnections.vue'
import StatusInstances from '~/components/StatusInstances.vue'
import StatusStats from '~/components/StatusStats.vue'

import axios from 'axios'

const updaterModule = namespace('updater')
const servicesModule = namespace('services')

@Component({
  components: {
    StatusInstances: StatusInstances as any,
    StatusStats: StatusStats as any,
    StatusConnections: StatusConnections as any,
  },
})
export default class extends Vue {
  @updaterModule.Action(actions.LOAD_VERSION) loadVersion
  @updaterModule.Getter('currentVersion') currentVersion

  async created() {
    await this.loadVersion()
  }
  data () {
    return {
      snackbar: true,
      y: 'top',
      x: null,
      mode: '',
      timeout: 20000,
      color: 'info',
    }
  }
}
</script>
<style scoped>
</style>
