<template>
      <v-card>
        <v-toolbar color="teal darken-1" dark>

          <v-toolbar-title >Thread Groups</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn nuxt to="connections/" center flat>
          Manage groups
          </v-btn>
        </v-toolbar>
                  <v-subheader>Active groups</v-subheader>
          <v-list
            subheader
            two-line
          >
      <template v-for="(connection, index) in connections">

        <v-divider :key="index + '-divider'"></v-divider>
        <v-list-tile :key="connection.id + '-real-elem'" nuxt :to="`/connections/${connection.id}/threads`">
          <v-list-tile-content>
            <v-list-tile-title>{{ connection.connectionName }}
            </v-list-tile-title>
            <v-list-tile-sub-title>
              Connects: {{ connection.threads.map((el) => el.service.moduleName).join(', ') }}
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

      </template>
        </v-list>
      </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'nuxt-property-decorator'
import { Action, namespace } from 'vuex-class'
import { Route } from 'vue-router'
import * as actions from '../store/modules/connections/actions.types'

const connectionsModule = namespace('connections')

@Component({
})
export default class StatusInstances extends Vue {
  @connectionsModule.Getter('connections') connections
  @connectionsModule.Action(actions.LOAD_CONNECTIONS) loadConnections

  async created() {
    this.loadConnections()
  }
}
</script>
