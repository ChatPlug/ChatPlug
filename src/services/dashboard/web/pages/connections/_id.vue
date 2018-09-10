<style scoped>
</style>
<template>
  <v-card v-if="currentConnection">
    <v-toolbar flat>
      <v-toolbar-title class="grey--text text--darken-4">{{currentConnection.connectionName}}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn flat color="red">
        Delete
      </v-btn>

    </v-toolbar>
    <v-tabs slider-color="primary">
      <v-tab ripple nuxt :to="baseURL + '/threads'">
        Threads
      </v-tab>
      <v-tab ripple nuxt :to="baseURL + '/messages'">
        Messages
      </v-tab>
    </v-tabs>
    <nuxt-child :currentConnection="currentConnection" />
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import axios from 'axios'
import ThreadConnection from '../../types/ThreadConnection'
import * as actions from '../../store/modules/connections/actions.types'

const connectionsModule = namespace('connections')

@Component({
  components: {
  },
})
export default class InstanceByID extends Vue {
  @connectionsModule.Getter('connections') connections: ThreadConnection[]

  id: string
  async asyncData({ params }) {
    return {
      ...params,
      baseURL: `/connections/${params.id}`,
    }
  }

  get currentConnection(): ThreadConnection | undefined {
    if (isNaN(this.id as any)) {
      return undefined
    }
    return this.connections.find(i => i.id === parseInt(this.id, undefined))
  }
}
</script>
