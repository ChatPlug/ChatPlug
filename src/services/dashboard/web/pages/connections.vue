<template>
  <section>
    <v-layout row wrap>
      <v-flex md4>
        <ThreadConnectionsList :connections="connections" />
      </v-flex>
      <v-flex md8 pl-2>
        <nuxt-child />
      </v-flex>
    </v-layout>
  </section>
</template>

<script lang="ts">
import ThreadConnectionsList from '~/components/ThreadConnectionsList.vue'
import { Component, Vue } from 'nuxt-property-decorator'
import { State, namespace, Action } from 'vuex-class'
import axios from 'axios'
import * as actions from '../store/modules/connections/actions.types'

const servicesModule = namespace('connections')

@Component({
  components: {
    ThreadConnectionsList: ThreadConnectionsList as any,
  },
})
export default class extends Vue {
  @servicesModule.Getter('connections') connections
  @servicesModule.Action(actions.LOAD_CONNECTIONS) loadConnections
  async created() {
    await this.loadConnections()
  }
}
</script>
<style scoped>
</style>
