<template>
  <v-card>
    <v-toolbar color="white" flat>
      <v-btn icon light>
        <nuxt-link to="/">
        <v-icon color="grey darken-2">arrow_back</v-icon>
        </nuxt-link>      </v-btn>
      <v-toolbar-title class="grey--text text--darken-4">Bridge groups</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn icon light>
        <v-icon color="grey darken-2">add</v-icon>
      </v-btn>
    </v-toolbar>
    <v-list two-line>
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

@Component({})
export default class ThreadConnectionsList extends Vue {
  @Prop() connections
}
</script>
